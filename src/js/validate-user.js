import { PHONE_PATTERNS, DEFAULT_PHONE_PATTERN } from './constants';
import { isNil, startsWithCapital } from './utils';

const CAPITALIZED_FIELDS = ['full_name', 'gender', 'note', 'state', 'city', 'country'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidPhone = (phone, country) => {
  if (typeof phone !== 'string') return false;
  const pattern = PHONE_PATTERNS[country] || DEFAULT_PHONE_PATTERN;
  return pattern.test(phone);
};

const isValidEmail = (email) => typeof email === 'string' && EMAIL_PATTERN.test(email);

const validateUser = (user) => {
  const errors = [];

  CAPITALIZED_FIELDS
    .filter((field) => !isNil(user[field]))
    .forEach((field) => {
      if (!startsWithCapital(user[field])) {
        errors.push(`${field} must be a string starting with a capital letter`);
      }
    });

  if (typeof user.age !== 'number' || !Number.isFinite(user.age)) {
    errors.push('age must be a number');
  }

  if (!isNil(user.phone) && !isValidPhone(user.phone, user.country)) {
    errors.push(`phone does not match the format for ${user.country || 'unknown country'}`);
  }

  if (!isNil(user.email) && !isValidEmail(user.email)) {
    errors.push('email must be a valid email address');
  }

  return { isValid: errors.length === 0, errors };
};

export default validateUser;
