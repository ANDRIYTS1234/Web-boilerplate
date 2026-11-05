import _ from 'lodash';
import dayjs from 'dayjs';
import { COURSES } from './constants';

export const isNil = (value) => _.isNil(value);

export const startsWithCapital = (value) => _.isString(value)
  && value.length > 0
  && value[0] === _.toUpper(value[0]);

export const getRandomCourse = () => _.sample(COURSES);

export const getRandomColor = () => {
  const hex = _.random(0, 0xffffff).toString(16).padStart(6, '0');
  return `#${hex}`;
};

export const generateId = () => _.uniqueId('teacher-');

export const normalizeCourse = (course) => {
  if (!_.isString(course)) return null;
  return _.find(COURSES, (item) => _.toLower(item) === _.toLower(course)) || null;
};

export const getAge = (birthDate) => {
  if (!birthDate || !dayjs(birthDate).isValid()) return null;
  return dayjs().diff(dayjs(birthDate), 'year');
};

export const getDaysToBirthday = (birthDate) => {
  if (!birthDate || !dayjs(birthDate).isValid()) return null;

  const today = dayjs().startOf('day');
  const birthday = dayjs(birthDate).year(today.year()).startOf('day');
  const nextBirthday = birthday.isBefore(today) ? birthday.add(1, 'year') : birthday;

  return nextBirthday.diff(today, 'day');
};

export const normalizeName = (name) => _.toLower(_.trim(name));

export const capitalize = (text) => _.upperFirst(text);

export const escapeHtml = (value) => _.escape(isNil(value) ? '' : String(value));
