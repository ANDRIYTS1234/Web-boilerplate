const includesText = (value, query) => typeof value === 'string'
  && value.toLowerCase().includes(query.toLowerCase());

const matchesSearch = (user, query) => {
  if (typeof query === 'number') return user.age === query;
  if (typeof query !== 'string' || query.trim() === '') return false;

  const text = query.trim();
  return includesText(user.full_name, text) || includesText(user.note, text);
};

const findUser = (users, query) => users.find((user) => matchesSearch(user, query));

export const searchUsers = (users, query) => users.filter((user) => matchesSearch(user, query));

export default findUser;
