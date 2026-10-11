import { isNil } from './utils';

const matchesAge = (age, condition) => {
  if (typeof condition === 'number') return age === condition;

  const { min = -Infinity, max = Infinity } = condition;
  return typeof age === 'number' && age >= min && age <= max;
};

const filterUsers = (users, {
  country, age, gender, favorite,
} = {}) => users.filter((user) => (
  (isNil(country) || user.country === country)
  && (isNil(age) || matchesAge(user.age, age))
  && (isNil(gender) || user.gender === gender)
  && (isNil(favorite) || user.favorite === favorite)
));

export default filterUsers;
