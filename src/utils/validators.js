/* ============================================
   Validators — the enquiry form
   --------------------------------------------
   Field-level validation for the single enquiry form
   (`UnifiedLeadForm`), which is the only consumer. Each helper returns
   an error STRING (empty string = valid) so the form can render it
   directly under the field.

   The four original exports (EMAIL_REGEX, getOptionalMobileErrorMessage,
   getEmailErrorMessage, getNameErrorMessage) keep their behaviour and their
   messages; names now accept letters of any script (prompt 05). Prompt 05
   adds getRequiredMobileErrorMessage and getOptionalEmailErrorMessage, which
   carry the IN-ARCH wording, and normalizeMobile, the input normaliser the
   form used to keep to itself.
   ============================================ */

/**
 * Email Validation Regex
 * Standard email validation pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Letters of any script (with their combining marks: Devanagari vowel signs,
 * Arabic diacritics …), spaces, full stops, apostrophes and hyphens.
 */
const NAME_PATTERN = /^[\p{L}\p{M}\s.'-]+$/u;

/**
 * Keep only digits, and forgive a pasted country / trunk prefix
 * ("+91 98765 43210" → "9876543210", "09876543210" → "9876543210")
 * before capping at 10. Used on every keystroke of the phone field, so a
 * typed eleventh digit is simply ignored, as it always was.
 * @param {string} value - Raw input
 * @returns {string} - At most 10 digits
 */
export const normalizeMobile = (value) => {
  let digits = String(value || '').replace(/\D/g, '');
  if (digits.length >= 12 && digits.startsWith('91')) digits = digits.slice(2);
  if (digits.length >= 11 && digits.startsWith('0')) digits = digits.slice(1);
  return digits.slice(0, 10);
};

/**
 * Get validation error message for a REQUIRED mobile number.
 * Module-local — the original messages, behind getOptionalMobileErrorMessage.
 * @param {string} mobile - Mobile number
 * @returns {string} - Error message or empty string
 */
const getMobileErrorMessage = (mobile) => {
  if (!mobile) return 'Mobile number is required';

  const cleanedMobile = mobile.replace(/[\s-]/g, '');

  if (cleanedMobile.length < 10) {
    return 'Mobile number must be 10 digits';
  }

  if (cleanedMobile.length > 10) {
    return 'Mobile number cannot exceed 10 digits';
  }

  if (!/^[6-9]/.test(cleanedMobile)) {
    return 'Mobile number must start with 6, 7, 8, or 9';
  }

  if (!/^\d+$/.test(cleanedMobile)) {
    return 'Mobile number can only contain digits';
  }

  return '';
};

/**
 * Get validation error message for an OPTIONAL mobile number.
 * An empty value is valid — but anything typed must still be a real Indian
 * mobile number.
 * @param {string} mobile - Mobile number (may be empty)
 * @returns {string} - Error message or empty string
 */
export const getOptionalMobileErrorMessage = (mobile) => {
  if (!mobile || !mobile.trim()) return '';
  return getMobileErrorMessage(mobile);
};

/**
 * Get validation error message for a REQUIRED Indian mobile number — the
 * IN-ARCH form's phone field (owner decision D-08: phone required).
 * Spaces, dashes, a "+91" country code and a leading trunk "0" are
 * forgiven; what remains must be exactly 10 digits starting 6–9.
 * @param {string} mobile - Mobile number
 * @returns {string} - Error message or empty string
 */
export const getRequiredMobileErrorMessage = (mobile) => {
  const raw = String(mobile || '').trim();
  if (!raw) return 'Please enter a 10-digit mobile number';
  if (/[^\d\s()+-]/.test(raw)) return 'Please enter a 10-digit mobile number';

  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+') || digits.length === 12) {
    // An explicit country code: only India's.
    if (!digits.startsWith('91')) return 'Please enter a 10-digit mobile number';
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) return 'Please enter a 10-digit mobile number';
  if (!/^[6-9]/.test(digits)) return 'Mobile numbers start with 6, 7, 8 or 9';
  return '';
};

/**
 * Get validation error message for email
 * @param {string} email - Email address
 * @returns {string} - Error message or empty string
 */
export const getEmailErrorMessage = (email) => {
  if (!email) return 'Email is required';

  const trimmedEmail = email.trim();

  if (!trimmedEmail.includes('@')) {
    return 'Please enter a valid email address';
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }

  return '';
};

/**
 * Get validation error message for an OPTIONAL email address: empty (or
 * only spaces) is valid; anything typed must be a real address.
 * @param {string} email - Email address (may be empty)
 * @returns {string} - Error message or empty string
 */
export const getOptionalEmailErrorMessage = (email) => {
  if (!email || !email.trim()) return '';
  return getEmailErrorMessage(email);
};

/**
 * Get validation error message for name
 * @param {string} name - Name
 * @returns {string} - Error message or empty string
 */
export const getNameErrorMessage = (name) => {
  if (!name) return 'Name is required';

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return 'Name must be at least 2 characters';
  }

  if (trimmedName.length > 50) {
    return 'Name cannot exceed 50 characters';
  }

  if (!NAME_PATTERN.test(trimmedName)) {
    return 'Name can only contain letters and spaces';
  }

  return '';
};
