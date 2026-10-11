/* eslint-disable no-console */
import { randomUserMock, additionalUsers } from './mock';
import formatUsers from './format-users';
import validateUser from './validate-user';
import filterUsers from './filter-users';
import sortUsers from './sort-users';
import findUser from './find-user';
import getMatchPercent from './match-percent';

const toRow = ({
  full_name: name, age, gender, country, course, favorite,
}) => ({
  name, age, gender, country, course, favorite,
});

const printTable = (title, users) => {
  console.groupCollapsed(`${title} (${users.length})`);
  console.table(users.map(toRow));
  console.groupEnd();
};

const runLab2Demo = () => {
  const users = formatUsers(randomUserMock, additionalUsers);

  console.group('Task 1: formatted users');
  console.log(`random: ${randomUserMock.length}, additional: ${additionalUsers.length}`);
  console.log(`after merge without duplicates: ${users.length}`);
  console.log('example:', users[0]);
  console.groupEnd();

  console.group('Task 2: validation');
  const results = users.map((user) => ({ user, ...validateUser(user) }));
  console.log(`valid: ${results.filter((r) => r.isValid).length} of ${results.length}`);
  console.table(results
    .filter((r) => !r.isValid)
    .map((r) => ({ name: r.user.full_name, errors: r.errors.join('; ') })));
  console.groupEnd();

  console.group('Task 3: filter');
  printTable('country: Norway', filterUsers(users, { country: 'Norway' }));
  printTable('gender: female, age 30-50', filterUsers(users, {
    gender: 'female', age: { min: 30, max: 50 },
  }));
  printTable('favorite: true', filterUsers(users, { favorite: true }));
  console.groupEnd();

  console.group('Task 4: sort');
  printTable('full_name asc', sortUsers(users, 'full_name'));
  printTable('age desc', sortUsers(users, 'age', 'desc'));
  printTable('b_day asc', sortUsers(users, 'b_day'));
  printTable('country desc', sortUsers(users, 'country', 'desc'));
  console.groupEnd();

  console.group('Task 5: search');
  console.log('name "Olivia":', findUser(users, 'Olivia'));
  console.log('note "cats":', findUser(users, 'cats'));
  console.log('age 65:', findUser(users, 65));
  console.groupEnd();

  console.group('Task 6: match percent');
  console.log(`age > 30: ${getMatchPercent(users, (user) => user.age > 30)}%`);
  console.log(`female: ${getMatchPercent(users, (user) => user.gender === 'female')}%`);
  console.groupEnd();

  return users;
};

export default runLab2Demo;
