import {
  isNil,
  getAge,
  generateId,
  getRandomColor,
  getRandomCourse,
  normalizeCourse,
  normalizeName,
} from './utils';

const getRandomUserId = ({ id, login }) => (id && id.value ? `${id.name}${id.value}` : login.uuid);

const formatRandomUser = (user) => ({
  gender: user.gender,
  title: user.name.title,
  full_name: `${user.name.first} ${user.name.last}`,
  city: user.location.city,
  state: user.location.state,
  country: user.location.country,
  postcode: user.location.postcode,
  coordinates: user.location.coordinates,
  timezone: user.location.timezone,
  email: user.email,
  b_day: user.dob.date,
  age: user.dob.age,
  phone: user.phone,
  picture_large: user.picture.large,
  picture_thumbnail: user.picture.thumbnail,
  id: getRandomUserId(user),
  favorite: false,
  course: getRandomCourse(),
  bg_color: getRandomColor(),
  note: null,
});

const withoutEmptyFields = (user) => Object.fromEntries(
  Object.entries(user).filter(([, value]) => !isNil(value)),
);

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
    age: typeof user.age === 'number' ? user.age : getAge(bDay),
    phone: user.phone || null,
    picture_large: user.picture_large || null,
    picture_thumbnail: user.picture_thumbnail || null,
    id: user.id ? String(user.id) : generateId(),
    favorite: user.favorite === true,
    course: normalizeCourse(user.course) || getRandomCourse(),
    bg_color: user.bg_color || getRandomColor(),
    note: typeof user.note === 'string' ? user.note : null,
  };
};

const formatUsers = (randomUsers = [], additionalUsers = []) => {
  const usersByName = new Map();

  randomUsers.map(formatRandomUser).forEach((user) => {
    usersByName.set(normalizeName(user.full_name), user);
  });

  additionalUsers.forEach((user) => {
    const key = normalizeName(user.full_name);
    const existing = usersByName.get(key) || {};
    usersByName.set(key, { ...existing, ...withoutEmptyFields(user) });
  });

  return [...usersByName.values()].map(normalizeUser);
};

export default formatUsers;
