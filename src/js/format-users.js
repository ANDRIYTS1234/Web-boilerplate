import _ from 'lodash';
import {
  isNil,
  getAge,
  generateId,
  getRandomColor,
  getRandomCourse,
  normalizeCourse,
  normalizeName,
} from './utils';

const getRandomUserId = (user) => {
  const value = _.get(user, 'id.value');
  return value ? `${_.get(user, 'id.name')}${value}` : _.get(user, 'login.uuid');
};

const formatRandomUser = (user) => ({
  gender: user.gender,
  title: _.get(user, 'name.title'),
  full_name: `${_.get(user, 'name.first')} ${_.get(user, 'name.last')}`,
  city: _.get(user, 'location.city'),
  state: _.get(user, 'location.state'),
  country: _.get(user, 'location.country'),
  postcode: _.get(user, 'location.postcode'),
  coordinates: _.get(user, 'location.coordinates'),
  timezone: _.get(user, 'location.timezone'),
  email: user.email,
  b_day: _.get(user, 'dob.date'),
  age: _.get(user, 'dob.age'),
  phone: user.phone,
  picture_large: _.get(user, 'picture.large'),
  picture_thumbnail: _.get(user, 'picture.thumbnail'),
  id: getRandomUserId(user),
  favorite: false,
  course: getRandomCourse(),
  bg_color: getRandomColor(),
  note: null,
});

const normalizeUser = (user) => {
  const bDay = user.b_day || null;

  return {
    gender: user.gender || null,
    title: user.title || null,
    full_name: user.full_name || null,
    city: user.city || null,
    state: user.state || null,
    country: user.country || null,
    postcode: isNil(user.postcode) ? null : user.postcode,
    coordinates: user.coordinates || null,
    timezone: user.timezone || null,
    email: user.email || null,
    b_day: bDay,
    age: _.isNumber(user.age) ? user.age : getAge(bDay),
    phone: user.phone || null,
    picture_large: user.picture_large || null,
    picture_thumbnail: user.picture_thumbnail || null,
    id: user.id ? String(user.id) : generateId(),
    favorite: user.favorite === true,
    course: normalizeCourse(user.course) || getRandomCourse(),
    bg_color: user.bg_color || getRandomColor(),
    note: _.isString(user.note) ? user.note : null,
  };
};

const formatUsers = (randomUsers = [], additionalUsers = []) => {
  const getKey = (user) => normalizeName(user.full_name);
  const usersByName = _.keyBy(_.map(randomUsers, formatRandomUser), getKey);

  _.forEach(additionalUsers, (user) => {
    const key = getKey(user);
    usersByName[key] = { ...usersByName[key], ..._.omitBy(user, _.isNil) };
  });

  return _.map(_.values(usersByName), normalizeUser);
};

export default formatUsers;
