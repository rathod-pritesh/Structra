const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email address is required.' };
  }
  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email address is required.' };
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@domain.com).' };
  }
  return { isValid: true, error: null };
}

export function validateName(name) {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Full name is required.' };
  }
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: 'Full name cannot be blank.' };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters.' };
  }
  return { isValid: true, error: null };
}

export function evaluatePasswordRules(password = '') {
  const safeStr = typeof password === 'string' ? password : '';
  const minLength = safeStr.length >= 8;
  const hasUpper = /[A-Z]/.test(safeStr);
  const hasLower = /[a-z]/.test(safeStr);
  const hasNumber = /[0-9]/.test(safeStr);
  const hasSpecial = SPECIAL_CHAR_REGEX.test(safeStr);

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    allValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
  };
}

export function validatePassword(password) {
  if (!password || typeof password !== 'string' || password.length === 0) {
    return { isValid: false, error: 'Password is required.' };
  }
  const rules = evaluatePasswordRules(password);
  if (!rules.allValid) {
    return { isValid: false, error: 'Password does not meet all security requirements.' };
  }
  return { isValid: true, error: null };
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || typeof confirmPassword !== 'string' || confirmPassword.length === 0) {
    return { isValid: false, error: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match.' };
  }
  return { isValid: true, error: null };
}
