import axios from 'axios';
import { logger } from '../../../shared/middleware';

interface Address {
  address: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

interface StandardizedAddress extends Address {
  latitude?: number;
  longitude?: number;
  confidence: number;
  components: {
    streetNumber?: string;
    streetName?: string;
    neighborhood?: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
  };
}

interface AddressValidationResult {
  isValid: boolean;
  confidence: number;
  standardizedAddress?: StandardizedAddress;
  suggestions?: StandardizedAddress[];
  error?: string;
  source: string;
  validatedAt: Date;
}

export class AddressValidationService {
  private readonly addressApiKey: string;
  private readonly geocodingApiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.addressApiKey = process.env.ADDRESS_VALIDATION_API_KEY || '';
    this.geocodingApiKey = process.env.GEOCODING_API_KEY || '';
    this.baseUrl = process.env.ADDRESS_VALIDATION_BASE_URL || 'https://api.addressvalidation.com';
  }

  /**
   * Validate address with external service
   */
  async validateAddress(address: Address): Promise<AddressValidationResult> {
    try {
      if (!this.addressApiKey) {
        logger.warn('Address validation API key not configured, using mock validation');
        return this.mockAddressValidation(address);
      }

      // Try multiple validation services for better accuracy
      const results = await Promise.allSettled([
        this.validateWithPrimaryService(address),
        this.validateWithGeocodingService(address)
      ]);

      // Use the best result
      const successfulResults = results
        .filter((result): result is PromiseFulfilledResult<AddressValidationResult> => 
          result.status === 'fulfilled' && result.value.isValid)
        .map(result => result.value)
        .sort((a, b) => b.confidence - a.confidence);

      if (successfulResults.length > 0) {
        return successfulResults[0];
      }

      // If no validation succeeded, return the first result
      const firstResult = results[0];
      if (firstResult.status === 'fulfilled') {
        return firstResult.value;
      }

      throw firstResult.reason;
    } catch (error) {
      logger.error('Address validation error:', error);
      return {
        isValid: false,
        confidence: 0,
        error: 'Address validation service unavailable',
        source: 'error',
        validatedAt: new Date()
      };
    }
  }

  /**
   * Validate with primary address validation service
   */
  private async validateWithPrimaryService(address: Address): Promise<AddressValidationResult> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/validate`,
        {
          address: address.address,
          city: address.city,
          state: address.state,
          country: address.country,
          postalCode: address.postalCode
        },
        {
          headers: {
            'Authorization': `Bearer ${this.addressApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.status === 200 && response.data) {
        const data = response.data;
        
        return {
          isValid: data.valid || false,
          confidence: data.confidence || 0,
          standardizedAddress: data.standardized ? {
            address: data.standardized.address,
            city: data.standardized.city,
            state: data.standardized.state,
            country: data.standardized.country,
            postalCode: data.standardized.postalCode,
            latitude: data.standardized.latitude,
            longitude: data.standardized.longitude,
            confidence: data.confidence || 0,
            components: data.standardized.components || {}
          } : undefined,
          suggestions: data.suggestions || [],
          source: 'primary_service',
          validatedAt: new Date()
        };
      }

      return {
        isValid: false,
        confidence: 0,
        error: 'Invalid response from address validation service',
        source: 'primary_service',
        validatedAt: new Date()
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          return {
            isValid: false,
            confidence: 0,
            error: 'Invalid address format',
            source: 'primary_service',
            validatedAt: new Date()
          };
        }
      }
      throw error;
    }
  }

  /**
   * Validate with geocoding service as backup
   */
  private async validateWithGeocodingService(address: Address): Promise<AddressValidationResult> {
    if (!this.geocodingApiKey) {
      throw new Error('Geocoding API key not configured');
    }

    try {
      const fullAddress = [
        address.address,
        address.city,
        address.state,
        address.country,
        address.postalCode
      ].filter(Boolean).join(', ');

      const response = await axios.get(
        'https://api.opencagedata.com/geocode/v1/json',
        {
          params: {
            q: fullAddress,
            key: this.geocodingApiKey,
            limit: 1,
            no_annotations: 0
          },
          timeout: 10000
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        const components = result.components;
        
        return {
          isValid: result.confidence >= 7, // OpenCage confidence scale is 1-10
          confidence: result.confidence / 10, // Normalize to 0-1
          standardizedAddress: {
            address: result.formatted,
            city: components.city || components.town || components.village || '',
            state: components.state || components.province || '',
            country: components.country || '',
            postalCode: components.postcode || '',
            latitude: result.geometry.lat,
            longitude: result.geometry.lng,
            confidence: result.confidence / 10,
            components: {
              streetNumber: components.house_number,
              streetName: components.road,
              neighborhood: components.neighbourhood || components.suburb,
              city: components.city || components.town || components.village,
              state: components.state || components.province,
              country: components.country,
              postalCode: components.postcode
            }
          },
          source: 'geocoding_service',
          validatedAt: new Date()
        };
      }

      return {
        isValid: false,
        confidence: 0,
        error: 'Address not found in geocoding database',
        source: 'geocoding_service',
        validatedAt: new Date()
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mock address validation for development/testing
   */
  private mockAddressValidation(address: Address): AddressValidationResult {
    // Simple mock validation logic
    const isValid = address.address.length >= 5 && 
                   address.city.length >= 2 && 
                   address.country.length >= 2;

    const confidence = isValid ? 0.9 : 0.1;

    const standardizedAddress: StandardizedAddress = {
      address: address.address.trim(),
      city: address.city.trim(),
      state: address.state?.trim(),
      country: address.country.trim(),
      postalCode: address.postalCode?.trim(),
      latitude: 40.7128, // Mock NYC coordinates
      longitude: -74.0060,
      confidence,
      components: {
        streetName: address.address.split(' ').slice(1).join(' '),
        streetNumber: address.address.split(' ')[0],
        city: address.city.trim(),
        state: address.state?.trim(),
        country: address.country.trim(),
        postalCode: address.postalCode?.trim()
      }
    };

    logger.info('Mock address validation', {
      input: address,
      result: { isValid, confidence }
    });

    return {
      isValid,
      confidence,
      standardizedAddress: isValid ? standardizedAddress : undefined,
      source: 'mock',
      validatedAt: new Date()
    };
  }

  /**
   * Get address suggestions for partial input
   */
  async getAddressSuggestions(partialAddress: string, country?: string): Promise<StandardizedAddress[]> {
    try {
      if (!this.addressApiKey) {
        return this.getMockAddressSuggestions(partialAddress);
      }

      const response = await axios.get(
        `${this.baseUrl}/v1/suggest`,
        {
          params: {
            q: partialAddress,
            country: country || 'US',
            limit: 5
          },
          headers: {
            'Authorization': `Bearer ${this.addressApiKey}`
          },
          timeout: 5000
        }
      );

      return response.data.suggestions || [];
    } catch (error) {
      logger.error('Address suggestions error:', error);
      return this.getMockAddressSuggestions(partialAddress);
    }
  }

  /**
   * Mock address suggestions
   */
  private getMockAddressSuggestions(partialAddress: string): StandardizedAddress[] {
    const mockSuggestions: StandardizedAddress[] = [
      {
        address: `${partialAddress} Street`,
        city: 'Sample City',
        state: 'Sample State',
        country: 'Sample Country',
        postalCode: '12345',
        confidence: 0.9,
        components: {
          streetName: `${partialAddress} Street`,
          city: 'Sample City',
          state: 'Sample State',
          country: 'Sample Country',
          postalCode: '12345'
        }
      },
      {
        address: `${partialAddress} Avenue`,
        city: 'Another City',
        state: 'Another State',
        country: 'Sample Country',
        postalCode: '54321',
        confidence: 0.8,
        components: {
          streetName: `${partialAddress} Avenue`,
          city: 'Another City',
          state: 'Another State',
          country: 'Sample Country',
          postalCode: '54321'
        }
      }
    ];

    return mockSuggestions;
  }

  /**
   * Validate postal code format for specific country
   */
  validatePostalCode(postalCode: string, country: string): boolean {
    const postalCodePatterns: Record<string, RegExp> = {
      'US': /^\d{5}(-\d{4})?$/,
      'CA': /^[A-Z]\d[A-Z] \d[A-Z]\d$/,
      'GB': /^[A-Z]{1,2}\d{1,2}[A-Z]? \d[A-Z]{2}$/,
      'DE': /^\d{5}$/,
      'FR': /^\d{5}$/,
      'IT': /^\d{5}$/,
      'ES': /^\d{5}$/,
      'AU': /^\d{4}$/,
      'IN': /^\d{6}$/,
      'CN': /^\d{6}$/,
      'JP': /^\d{3}-\d{4}$/
    };

    const pattern = postalCodePatterns[country.toUpperCase()];
    return pattern ? pattern.test(postalCode) : true; // Allow if no pattern defined
  }

  /**
   * Check if address validation service is available
   */
  async checkServiceHealth(): Promise<boolean> {
    if (!this.addressApiKey) {
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.addressApiKey}`
        },
        timeout: 5000
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Address validation service health check failed:', error);
      return false;
    }
  }
}