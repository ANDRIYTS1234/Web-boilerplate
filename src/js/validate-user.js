import _ from 'lodash';
import { PHONE_PATTERNS, DEFAULT_PHONE_PATTERN } from './constants';
import { isNil, startsWithCapital } from './utils';

const CAPITALIZED_FIELDS = ['full_name', 'gender', 'note', 'state', 'city', 'country'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidPhone = (phone, country) => {
  if (!_.isString(phone)) return false;
  const pattern = PHONE_PATTERNS[country] || DEFAULT_PHONE_PATTERN;
  return pattern.test(phone);
};

export const isValidEmail = (email) => _.isString(email) && EMAIL_PATTERN.test(email);

const validateUser = (user) => {
  const wrongFields = _.filter(
    CAPITALIZED_FIELDS,
    (field) => !isNil(user[field]) && !startsWithCapital(user[field]),
  );
  const errors = _.map(wrongFields, (field) => `${field} must be a string starting with a capital letter`);

  if (!_.isFinite(user.age)) {
    errors.push('age must be a number');
  }

  if (!isNil(user.phone) && !isValidPhone(user.phone, user.country)) {
    errors.push(`phone does not match the format for ${user.country || 'unknown country'}`);
  }

  if (!isNil(user.email) && !isValidEmail(user.email)) {
    errors.push('email must be a valid email address');
  }

  return { isValid: _.isEmpty(errors), errors };
};

export default validateUser;
