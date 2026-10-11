import { COURSES } from './constants';

export const isNil = (value) => value === null || value === undefined;

export const startsWithCapital = (value) => typeof value === 'string'
  && value.length > 0
  && value[0] === value[0].toUpperCase();

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];

export const getRandomCourse = () => getRandomItem(COURSES);

export const getRandomColor = () => {
  const hex = Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
  return `#${hex}`;
};

export const generateId = () => Math.random().toString(36).slice(2, 12);

export const normalizeCourse = (course) => {
  if (typeof course !== 'string') return null;
  return COURSES.find((item) => item.toLowerCase() === course.toLowerCase()) || null;
};

export const getAge = (birthDate, now = new Date()) => {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;

  const age = now.getFullYear() - birth.getFullYear();
  const hadBirthday = now.getMonth() > birth.getMonth()
    || (now.getMonth() === birth.getMonth() && now.getDate() >= birth.getDate());

  return hadBirthday ? age : age - 1;
};

export const normalizeName = (name) => (typeof name === 'string' ? name.trim().toLowerCase() : '');
