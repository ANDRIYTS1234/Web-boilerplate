import _ from 'lodash';

const includesText = (value, query) => _.isString(value)
  && _.includes(_.toLower(value), _.toLower(query));

const matchesSearch = (user, query) => {
  if (_.isNumber(query)) return user.age === query;
  if (!_.isString(query) || _.trim(query) === '') return false;

  const text = _.trim(query);
  return includesText(user.full_name, text) || includesText(user.note, text);
};

const findUser = (users, query) => _.find(users, (user) => matchesSearch(user, query));

export const searchUsers = (users, query) => _.filter(users, (user) => matchesSearch(user, query));

export default findUser;
