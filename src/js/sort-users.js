import _ from 'lodash';
import { SORTABLE_FIELDS } from './constants';
import { isNil } from './utils';

const getSortValue = (user, field) => {
  if (field === 'b_day') return new Date(user.b_day).getTime();
  if (_.isString(user[field])) return _.toLower(user[field]);
  return user[field];
};

const sortUsers = (users, field, order = 'asc') => {
  if (!_.includes(SORTABLE_FIELDS, field)) {
    throw new Error(`Cannot sort by "${field}". Allowed fields: ${SORTABLE_FIELDS.join(', ')}`);
  }

  return _.orderBy(
    users,
    [(user) => isNil(user[field]), (user) => getSortValue(user, field)],
    ['asc', order],
  );
};

export default sortUsers;
