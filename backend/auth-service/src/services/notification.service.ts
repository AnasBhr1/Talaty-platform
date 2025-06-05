// backend/auth-service/src/services/notification.service.ts

import nodemailer from 'nodemailer';
import { logger } from '../../../shared/middleware';

// Email templates
const emailTemplates = {
  'welcome-verification': {
    subject: 'Welcome to Talaty - Verify Your Email',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Talaty</h1>
          <p style="color: white; margin: 10px 0 0 0;">Your business verification platform</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello ${data.firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for joining Talaty. To complete your registration and secure your account, 
            please verify your email address using the verification code below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #667eea; color: white; padding: 15px 30px; display: inline-block; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
              ${data.otp}
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This verification code will expire in <strong>${data.expiresIn}</strong>. 
            If you didn't create an account with Talaty, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px;">
            Need help? Contact us at <a href="mailto:support@talaty.app" style="color: #667eea;">support@talaty.app</a>
          </p>
        </div>
      </div>
    `
  },
  
  'email-verification': {
    subject: 'Verify Your Email - Talaty',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Email Verification</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello ${data.firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Please verify your email address using the verification code below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: #667eea; color: white; padding: 15px 30px; display: inline-block; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
              ${data.otp}
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This verification code will expire in <strong>${data.expiresIn}</strong>.
          </p>
        </div>
      </div>
    `
  },
  
  'password-reset': {
    subject: 'Reset Your Password - Talaty',
    html: (data: any) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Reset</h1>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333;">Hello ${data.firstName}!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            This link will expire in <strong>${data.expiresIn}</strong>. 
            If you didn't request a password reset, please ignore this email.
          </p>
          
          <p style="color: #999; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${data.resetUrl}" style="color: #667eea; word-break: break-all;">${data.resetUrl}</a>
          </p>
        </div>
      </div>
    `
  }
};

// Configure email transporter
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send email function
export const sendEmail = async (
  to: string,
  subject: string,
  templateId: string,
  templateData: any
): Promise<void> => {
  try {
    const transporter = createEmailTransporter();
    
    // Get template
    const template = emailTemplates[templateId as keyof typeof emailTemplates];
    if (!template) {
      throw new Error(`Email template '${templateId}' not found`);
    }
    
    // Prepare email content
    const emailSubject = template.subject || subject;
    const htmlContent = template.html(templateData);
    
    // Send email
    const mailOptions = {
      from: `${process.env.FROM_NAME || 'Talaty'} <${process.env.FROM_EMAIL}>`,
      to,
      subject: emailSubject,
      html: htmlContent,
      // Add text version for better deliverability
      text: htmlContent.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Email sent successfully to ${to}`, {
      messageId: info.messageId,
      templateId,
      subject: emailSubject
    });
    
  } catch (error) {
    logger.error(`Failed to send email to ${to}:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      templateId,
      subject
    });
    throw error;
  }
};

// Send SMS function (using Twilio)
export const sendSMS = async (
  to: string,
  message: string
): Promise<void> => {
  try {
    // Import Twilio dynamically to avoid dependency issues if not configured
    const twilio = require('twilio');
    
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('SMS service not configured - Twilio credentials missing');
      return;
    }
    
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    
    logger.info(`SMS sent successfully to ${to}`, {
      sid: result.sid,
      status: result.status
    });
    
  } catch (error) {
    logger.error(`Failed to send SMS to ${to}:`, {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
};

// Send OTP via SMS
export const sendOTPSMS = async (
  to: string,
  otp: string,
  purpose: string = 'verification'
): Promise<void> => {
  const message = `Your Talaty ${purpose} code is: ${otp}. This code will expire in 15 minutes. Do not share this code with anyone.`;
  await sendSMS(to, message);
};

// Verify email configuration
export const verifyEmailConfig = async (): Promise<boolean> => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    logger.info('Email configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('Email configuration verification failed:', error);
    return false;
  }
};

// Verify SMS configuration
export const verifySMSConfig = async (): Promise<boolean> => {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      logger.warn('SMS configuration not provided');
      return false;
    }
    
    const twilio = require('twilio');
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Verify account
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    logger.info('SMS configuration verified successfully');
    return true;
  } catch (error) {
    logger.error('SMS configuration verification failed:', error);
    return false;
  }
};