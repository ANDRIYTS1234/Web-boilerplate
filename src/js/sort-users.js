import { SORTABLE_FIELDS } from './constants';
import { isNil } from './utils';

const compareValues = (a, b, field) => {
  if (field === 'b_day') return new Date(a) - new Date(b);
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
};

const sortUsers = (users, field, order = 'asc') => {
  if (!SORTABLE_FIELDS.includes(field)) {
    throw new Error(`Cannot sort by "${field}". Allowed fields: ${SORTABLE_FIELDS.join(', ')}`);
  }

  const direction = order === 'desc' ? -1 : 1;

  return [...users].sort((first, second) => {
    const a = first[field];
    const b = second[field];

    if (isNil(a) && isNil(b)) return 0;
    if (isNil(a)) return 1;
    if (isNil(b)) return -1;

    return compareValues(a, b, field) * direction;
  });
};

export default sortUsers;
