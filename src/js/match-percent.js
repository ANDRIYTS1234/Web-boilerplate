import _ from 'lodash';

const getMatchPercent = (users, predicate) => {
  if (_.isEmpty(users)) return 0;

  const matched = _.filter(users, predicate).length;
  return _.round((matched / users.length) * 100, 2);
};

export default getMatchPercent;
