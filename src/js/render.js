import _ from 'lodash';
import { capitalize, escapeHtml, getDaysToBirthday } from './utils';

const getInitials = (fullName) => fullName
  .split(' ')
  .map((part) => part[0])
  .join('.');

const cardTemplate = (user, isFavoritesList) => {
  const [firstName, ...lastName] = user.full_name.split(' ');
  const cardClass = user.favorite && !isFavoritesList ? 'card card--favorite' : 'card';
  const avatarClass = user.picture_large ? 'card__avatar' : 'card__avatar card__avatar--initials';
  const avatar = user.picture_large
    ? `<img src="${escapeHtml(user.picture_large)}" alt="${escapeHtml(user.full_name)}">`
    : escapeHtml(getInitials(user.full_name));
  const subject = isFavoritesList ? '' : `<p class="card__subject">${escapeHtml(user.course)}</p>`;

  return `
    <li class="${cardClass}" data-id="${escapeHtml(user.id)}">
      <a href="#teacher-info" class="${avatarClass}">${avatar}</a>
      <h3 class="card__name">${escapeHtml(firstName)}<br>${escapeHtml(lastName.join(' '))}</h3>
      ${subject}
      <p class="card__country">${escapeHtml(user.country)}</p>
    </li>`;
};

export const renderTeachers = (users) => {
  const list = document.getElementById('teachers-list');
  list.innerHTML = users.length
    ? users.map((user) => cardTemplate(user, false)).join('')
    : '<li class="teachers__empty">No teachers found</li>';
};

export const renderMessage = (text) => {
  document.getElementById('teachers-list').innerHTML = `<li class="teachers__empty">${escapeHtml(text)}</li>`;
};

export const renderStatsCount = (visibleCount, totalCount, percent) => {
  document.getElementById('stats-count').textContent = `Showing ${visibleCount} of ${totalCount} teachers (${percent}%)`;
};

export const renderFavorites = (users) => {
  const list = document.getElementById('favorites-list');
  list.innerHTML = users.map((user) => cardTemplate(user, true)).join('');
};

export const renderCountryOptions = (users) => {
  const select = document.getElementById('f-country');
  const selected = select.value;
  const countries = _.sortBy(_.compact(_.uniq(_.map(users, 'country'))));
  const options = _.map(
    countries,
    (country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`,
  ).join('');

  select.innerHTML = `<option value="">All</option>${options}`;
  select.value = selected;
};

const getBirthdayText = (birthDate) => {
  const days = getDaysToBirthday(birthDate);
  if (days === null) return '';
  if (days === 0) return 'Birthday is today!';
  return `Days until birthday: ${days}`;
};

export const renderTeacherInfo = (user) => {
  const photo = document.getElementById('info-photo');
  const email = document.getElementById('info-email');
  const star = document.getElementById('info-star');
  const age = user.age === null ? '' : `${user.age}, `;

  photo.hidden = !user.picture_large;
  if (user.picture_large) {
    photo.src = user.picture_large;
    photo.alt = user.full_name;
  }

  document.getElementById('info-name').textContent = user.full_name;
  document.getElementById('info-course').textContent = user.course;
  document.getElementById('info-location').textContent = _.compact([user.city, user.country])
    .join(', ');
  document.getElementById('info-age').textContent = `${age}${capitalize(user.gender)}`;
  document.getElementById('info-phone').textContent = user.phone || '';
  document.getElementById('info-note').textContent = user.note || '';
  document.getElementById('info-birthday').textContent = getBirthdayText(user.b_day);
  document.getElementById('info-map-toggle').hidden = !user.coordinates;

  email.textContent = user.email || '';
  email.href = user.email ? `mailto:${user.email}` : '#teacher-info';

  star.classList.toggle('teacher-info__star--active', user.favorite);
};

export const renderStatsView = (view) => {
  document.getElementById('stats-chart-view').hidden = view !== 'chart';
  document.getElementById('stats-report-view').hidden = view === 'chart';

  document.querySelectorAll('[data-view]').forEach((button) => {
    button.classList.toggle('btn--active', button.dataset.view === view);
  });
};
