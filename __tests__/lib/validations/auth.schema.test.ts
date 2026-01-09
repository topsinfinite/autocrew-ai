/**
 * Auth Validation Schema Tests
 *
 * Tests for authentication validation schemas.
 */

import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  setupPasswordSchema,
} from '@/lib/validations/auth.schema';

describe('loginSchema', () => {
  it('should validate correct login credentials', () => {
    const data = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = {
      email: 'invalid-email',
      password: 'Password123!',
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('email');
    }
  });

  it('should reject missing password', () => {
    const data = {
      email: 'test@example.com',
    };

    const result = loginSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should convert email to lowercase', () => {
    const data = {
      email: 'TEST@EXAMPLE.COM',
      password: 'Password123!',
    };

    const result = loginSchema.safeParse(data);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});

describe('signupSchema', () => {
  const validSignupData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    companyName: 'ACME Corp',
    acceptTerms: true,
  };

  it('should validate correct signup data', () => {
    const result = signupSchema.safeParse(validSignupData);
    expect(result.success).toBe(true);
  });

  it('should reject password without lowercase letter', () => {
    const data = {
      ...validSignupData,
      password: 'PASSWORD123!',
      confirmPassword: 'PASSWORD123!',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('lowercase');
    }
  });

  it('should reject password without uppercase letter', () => {
    const data = {
      ...validSignupData,
      password: 'password123!',
      confirmPassword: 'password123!',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('uppercase');
    }
  });

  it('should reject password without number', () => {
    const data = {
      ...validSignupData,
      password: 'Password!',
      confirmPassword: 'Password!',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('number');
    }
  });

  it('should reject password without special character', () => {
    const data = {
      ...validSignupData,
      password: 'Password123',
      confirmPassword: 'Password123',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('special character');
    }
  });

  it('should reject password shorter than 8 characters', () => {
    const data = {
      ...validSignupData,
      password: 'Pass1!',
      confirmPassword: 'Pass1!',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 8 characters');
    }
  });

  it('should reject mismatched passwords', () => {
    const data = {
      ...validSignupData,
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("don't match");
    }
  });

  it('should reject if terms not accepted', () => {
    const data = {
      ...validSignupData,
      acceptTerms: false,
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('terms');
    }
  });

  it('should reject name shorter than 2 characters', () => {
    const data = {
      ...validSignupData,
      name: 'J',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject company name shorter than 2 characters', () => {
    const data = {
      ...validSignupData,
      companyName: 'A',
    };

    const result = signupSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('forgotPasswordSchema', () => {
  it('should validate correct email', () => {
    const data = { email: 'test@example.com' };
    const result = forgotPasswordSchema.safeParse(data);

    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const data = { email: 'invalid' };
    const result = forgotPasswordSchema.safeParse(data);

    expect(result.success).toBe(false);
  });

  it('should convert email to lowercase', () => {
    const data = { email: 'TEST@EXAMPLE.COM' };
    const result = forgotPasswordSchema.safeParse(data);

    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
    }
  });
});

describe('resetPasswordSchema', () => {
  const validResetData = {
    token: 'valid-reset-token',
    password: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
  };

  it('should validate correct reset data', () => {
    const result = resetPasswordSchema.safeParse(validResetData);
    expect(result.success).toBe(true);
  });

  it('should reject mismatched passwords', () => {
    const data = {
      ...validResetData,
      confirmPassword: 'DifferentPassword123!',
    };

    const result = resetPasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject weak password', () => {
    const data = {
      ...validResetData,
      password: 'weak',
      confirmPassword: 'weak',
    };

    const result = resetPasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject missing token', () => {
    const data = {
      password: 'NewPassword123!',
      confirmPassword: 'NewPassword123!',
    };

    const result = resetPasswordSchema.safeParse(data);
    expect(result.success).toBe(false);
  });
});

describe('setupPasswordSchema', () => {
  const validSetupData = {
    token: 'valid-setup-token',
    password: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
  };

  it('should validate correct setup data', () => {
    const result = setupPasswordSchema.safeParse(validSetupData);
    expect(result.success).toBe(true);
  });

  it('should have same validation as resetPasswordSchema', () => {
    // Setup and reset password should have identical validation
    const data = {
      ...validSetupData,
      password: 'weak',
      confirmPassword: 'weak',
    };

    const setupResult = setupPasswordSchema.safeParse(data);
    const resetResult = resetPasswordSchema.safeParse(data);

    expect(setupResult.success).toBe(resetResult.success);
  });
});
