// backend/user-service/src/services/businessVerification.service.ts

import axios from 'axios';
import { logger } from '../../../shared/middleware';

interface BusinessRegistrationData {
  registrationNumber: string;
  businessName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DISSOLVED';
  registrationDate: string;
  businessType: string;
  address?: string;
  officers?: Array<{
    name: string;
    role: string;
    appointmentDate: string;
  }>;
}

interface BusinessVerificationResult {
  isValid: boolean;
  data?: BusinessRegistrationData;
  error?: string;
  source: string;
  verifiedAt: Date;
}

export class BusinessVerificationService {
  private readonly businessRegistryApiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.businessRegistryApiKey = process.env.BUSINESS_REGISTRY_API_KEY || '';
    this.baseUrl = process.env.BUSINESS_REGISTRY_BASE_URL || 'https://api.businessregistry.gov';
  }

  /**
   * Verify business registration with external registry
   */
  async verifyBusinessRegistration(
    registrationNumber: string,
    businessName: string
  ): Promise<boolean> {
    try {
      if (!this.businessRegistryApiKey) {
        logger.warn('Business registry API key not configured, skipping verification');
        return this.mockBusinessVerification(registrationNumber, businessName);
      }

      const result = await this.verifyWithExternalRegistry(registrationNumber, businessName);
      
      if (result.isValid && result.data) {
        // Additional validation: check if business name matches
        const nameMatch = this.fuzzyMatchBusinessName(businessName, result.data.businessName);
        return nameMatch && result.data.status === 'ACTIVE';
      }

      return false;
    } catch (error) {
      logger.error('Business verification error:', error);
      // Fallback to mock verification in case of external service failure
      return this.mockBusinessVerification(registrationNumber, businessName);
    }
  }

  /**
   * Get detailed business information
   */
  async getBusinessDetails(registrationNumber: string): Promise<BusinessVerificationResult> {
    try {
      if (!this.businessRegistryApiKey) {
        logger.warn('Business registry API key not configured, returning mock data');
        return this.getMockBusinessDetails(registrationNumber);
      }

      return await this.verifyWithExternalRegistry(registrationNumber);
    } catch (error) {
      logger.error('Get business details error:', error);
      return {
        isValid: false,
        error: 'Failed to retrieve business details',
        source: 'external_registry',
        verifiedAt: new Date()
      };
    }
  }

  /**
   * Verify with external business registry API
   */
  private async verifyWithExternalRegistry(
    registrationNumber: string,
    businessName?: string
  ): Promise<BusinessVerificationResult> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/v1/business/${registrationNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.businessRegistryApiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 seconds timeout
        }
      );

      if (response.status === 200 && response.data) {
        const businessData: BusinessRegistrationData = response.data;
        
        return {
          isValid: true,
          data: businessData,
          source: 'external_registry',
          verifiedAt: new Date()
        };
      }

      return {
        isValid: false,
        error: 'Business not found in registry',
        source: 'external_registry',
        verifiedAt: new Date()
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          return {
            isValid: false,
            error: 'Business registration not found',
            source: 'external_registry',
            verifiedAt: new Date()
          };
        }
        
        if (error.response?.status === 401) {
          logger.error('Business registry API authentication failed');
          return {
            isValid: false,
            error: 'API authentication failed',
            source: 'external_registry',
            verifiedAt: new Date()
          };
        }
      }

      throw error;
    }
  }

  /**
   * Fuzzy match business names (handles minor differences)
   */
  private fuzzyMatchBusinessName(inputName: string, registryName: string): boolean {
    // Normalize names for comparison
    const normalize = (name: string) => 
      name.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();

    const normalizedInput = normalize(inputName);
    const normalizedRegistry = normalize(registryName);

    // Exact match
    if (normalizedInput === normalizedRegistry) {
      return true;
    }

    // Check if one contains the other (for cases like "ABC Corp" vs "ABC Corporation")
    if (normalizedInput.includes(normalizedRegistry) || normalizedRegistry.includes(normalizedInput)) {
      return true;
    }

    // Calculate similarity using Levenshtein distance
    const similarity = this.calculateSimilarity(normalizedInput, normalizedRegistry);
    return similarity >= 0.8; // 80% similarity threshold
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : (maxLength - matrix[str2.length][str1.length]) / maxLength;
  }

  /**
   * Mock business verification for development/testing
   */
  private mockBusinessVerification(registrationNumber: string, businessName: string): boolean {
    // Simple mock logic for testing
    const validPrefixes = ['ABC', 'XYZ', '123', 'TEST'];
    const hasValidPrefix = validPrefixes.some(prefix => 
      registrationNumber.toUpperCase().startsWith(prefix)
    );

    const hasValidName = businessName && businessName.length >= 3;

    logger.info('Mock business verification', {
      registrationNumber,
      businessName,
      result: hasValidPrefix && hasValidName
    });

    return hasValidPrefix && hasValidName;
  }

  /**
   * Get mock business details for development/testing
   */
  private getMockBusinessDetails(registrationNumber: string): BusinessVerificationResult {
    const mockData: BusinessRegistrationData = {
      registrationNumber,
      businessName: `Mock Business ${registrationNumber}`,
      status: 'ACTIVE',
      registrationDate: '2020-01-15',
      businessType: 'LLC',
      address: '123 Business St, Business City, BC 12345',
      officers: [
        {
          name: 'John Doe',
          role: 'CEO',
          appointmentDate: '2020-01-15'
        },
        {
          name: 'Jane Smith',
          role: 'CFO',
          appointmentDate: '2020-02-01'
        }
      ]
    };

    return {
      isValid: true,
      data: mockData,
      source: 'mock',
      verifiedAt: new Date()
    };
  }

  /**
   * Validate business type
   */
  async validateBusinessType(businessType: string, registrationNumber: string): Promise<boolean> {
    try {
      const details = await this.getBusinessDetails(registrationNumber);
      
      if (details.isValid && details.data) {
        // Normalize business types for comparison
        const normalizeType = (type: string) => type.toLowerCase().replace(/[^a-z]/g, '');
        
        const inputType = normalizeType(businessType);
        const registryType = normalizeType(details.data.businessType);
        
        return inputType === registryType;
      }

      return false;
    } catch (error) {
      logger.error('Business type validation error:', error);
      return false;
    }
  }

  /**
   * Get business status
   */
  async getBusinessStatus(registrationNumber: string): Promise<string | null> {
    try {
      const details = await this.getBusinessDetails(registrationNumber);
      return details.data?.status || null;
    } catch (error) {
      logger.error('Get business status error:', error);
      return null;
    }
  }

  /**
   * Check if business registry service is available
   */
  async checkServiceHealth(): Promise<boolean> {
    if (!this.businessRegistryApiKey) {
      return false;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.businessRegistryApiKey}`
        },
        timeout: 5000
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Business registry service health check failed:', error);
      return false;
    }
  }
}