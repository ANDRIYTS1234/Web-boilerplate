import { generateId, getAge, startsWithCapital } from './utils';
import { isValidEmail, isValidPhone } from './validate-user';

export const getUserFromForm = (form) => {
  const data = new FormData(form);
  const getField = (name) => String(data.get(name) || '').trim();
  const birthDate = getField('b_day');
  const bDay = birthDate ? new Date(birthDate).toISOString() : null;

  return {
    gender: getField('gender') || null,
    title: null,
    full_name: getField('full_name'),
    city: getField('city'),
    state: null,
    country: getField('country'),
    postcode: null,
    coordinates: null,
    timezone: null,
    email: getField('email'),
    b_day: bDay,
    age: getAge(bDay),
    phone: getField('phone'),
    picture_large: null,
    picture_thumbnail: null,
    id: generateId(),
    favorite: false,
    course: getField('course'),
    bg_color: getField('bg_color'),
    note: getField('note') || null,
  };
};

export const validateNewUser = (user) => {
  const errors = [];

  if (!startsWithCapital(user.full_name)) {
    errors.push('Name must start with a capital letter.');
  }
  if (!startsWithCapital(user.city)) {
    errors.push('City must start with a capital letter.');
  }
  if (!isValidEmail(user.email)) {
    errors.push('Email is not valid.');
  }
  if (!isValidPhone(user.phone, user.country)) {
    errors.push(`Phone does not match the format for ${user.country}.`);
  }
  if (typeof user.age !== 'number' || user.age < 0) {
    errors.push('Enter a valid date of birth.');
  }
  if (!user.gender) {
    errors.push('Choose sex.');
  }
  if (user.note && !startsWithCapital(user.note)) {
    errors.push('Notes must start with a capital letter.');
  }

  return errors;
};
