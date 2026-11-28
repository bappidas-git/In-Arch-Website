import {
  EMAIL_REGEX,
  getEmailErrorMessage,
  getNameErrorMessage,
  getOptionalEmailErrorMessage,
  getOptionalMobileErrorMessage,
  getRequiredMobileErrorMessage,
  normalizeMobile,
} from '../validators';

describe('names', () => {
  it.each(['Rahul Kumar', 'राहुल', "O'Brien", 'Anne-Marie', 'Dr. A. Khan', 'محمد حسن الدين', 'Zoë'])('accepts %s', (name) => {
    expect(getNameErrorMessage(name)).toBe('');
  });

  it('rejects a single letter, digits and 51 characters (messages unchanged)', () => {
    expect(getNameErrorMessage('R')).toBe('Name must be at least 2 characters');
    expect(getNameErrorMessage('Rahul 2')).toBe('Name can only contain letters and spaces');
    expect(getNameErrorMessage('12345')).toBe('Name can only contain letters and spaces');
    expect(getNameErrorMessage('a'.repeat(51))).toBe('Name cannot exceed 50 characters');
    expect(getNameErrorMessage('a'.repeat(50))).toBe('');
    expect(getNameErrorMessage('')).toBe('Name is required');
  });
});

describe('required mobile', () => {
  it('accepts 9876543210 and forgives +91 / 0 prefixes', () => {
    expect(getRequiredMobileErrorMessage('9876543210')).toBe('');
    expect(getRequiredMobileErrorMessage('+91 98765 43210')).toBe('');
    expect(getRequiredMobileErrorMessage('09876543210')).toBe('');
    expect(getRequiredMobileErrorMessage('919876543210')).toBe('');
    expect(getRequiredMobileErrorMessage('98765-43210')).toBe('');
  });

  it('normalises +91 98765 43210 and 09876543210 to ten digits', () => {
    expect(normalizeMobile('+91 98765 43210')).toBe('9876543210');
    expect(normalizeMobile('09876543210')).toBe('9876543210');
    expect(normalizeMobile('98765 43210 99')).toBe('9876543210');
    expect(normalizeMobile('')).toBe('');
    expect(normalizeMobile(undefined)).toBe('');
  });

  it('rejects 5876543210, nine digits, letters, another country and empty', () => {
    expect(getRequiredMobileErrorMessage('5876543210')).toBe('Mobile numbers start with 6, 7, 8 or 9');
    expect(getRequiredMobileErrorMessage('987654321')).toBe('Please enter a 10-digit mobile number');
    expect(getRequiredMobileErrorMessage('98765abcde')).toBe('Please enter a 10-digit mobile number');
    expect(getRequiredMobileErrorMessage('+1 202 555 0123')).toBe('Please enter a 10-digit mobile number');
    expect(getRequiredMobileErrorMessage('')).toBe('Please enter a 10-digit mobile number');
    expect(getRequiredMobileErrorMessage('   ')).toBe('Please enter a 10-digit mobile number');
  });

  it('keeps the optional mobile helper as it was', () => {
    expect(getOptionalMobileErrorMessage('')).toBe('');
    expect(getOptionalMobileErrorMessage('9876543210')).toBe('');
    expect(getOptionalMobileErrorMessage('5876543210')).toBe('Mobile number must start with 6, 7, 8, or 9');
    expect(getOptionalMobileErrorMessage('98765')).toBe('Mobile number must be 10 digits');
  });
});

describe('email', () => {
  it('optional email accepts empty and validates anything typed', () => {
    expect(getOptionalEmailErrorMessage('')).toBe('');
    expect(getOptionalEmailErrorMessage('   ')).toBe('');
    expect(getOptionalEmailErrorMessage(undefined)).toBe('');
    expect(getOptionalEmailErrorMessage('rahul@example.com')).toBe('');
    expect(getOptionalEmailErrorMessage('rahul@')).toBe('Please enter a valid email address');
  });

  it('keeps the required email helper and the regex', () => {
    expect(getEmailErrorMessage('')).toBe('Email is required');
    expect(getEmailErrorMessage('nope')).toBe('Please enter a valid email address');
    expect(EMAIL_REGEX.test('a.b+c@d.co')).toBe(true);
  });
});
