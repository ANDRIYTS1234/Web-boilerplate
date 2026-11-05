import _ from 'lodash';
import { isNil } from './utils';

const matchesAge = (age, condition) => {
  if (_.isNumber(condition)) return age === condition;

  const { min = -Infinity, max = Infinity } = condition;
  return _.isNumber(age) && _.inRange(age, min, max + 1);
};

const filterUsers = (users, {
  country, age, gender, favorite,
} = {}) => _.filter(users, (user) => (
  (isNil(country) || user.country === country)
  && (isNil(age) || matchesAge(user.age, age))
  && (isNil(gender) || user.gender === gender)
  && (isNil(favorite) || user.favorite === favorite)
));

export default filterUsers;
