import { PAGE_SIZE } from './constants';
import { capitalize, escapeHtml } from './utils';

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

const rowTemplate = (user) => `
  <tr>
    <td>${escapeHtml(user.full_name)}</td>
    <td>${escapeHtml(user.course)}</td>
    <td>${escapeHtml(user.age)}</td>
    <td>${escapeHtml(capitalize(user.gender))}</td>
    <td>${escapeHtml(user.country)}</td>
  </tr>`;

export const renderTeachers = (users) => {
  const list = document.getElementById('teachers-list');
  list.innerHTML = users.length
    ? users.map((user) => cardTemplate(user, false)).join('')
    : '<li class="teachers__empty">No teachers found</li>';
};

export const renderFavorites = (users) => {
  const list = document.getElementById('favorites-list');
  list.innerHTML = users.map((user) => cardTemplate(user, true)).join('');
};

export const renderTable = (users, page) => {
  const start = (page - 1) * PAGE_SIZE;
  const body = document.getElementById('stats-body');
  body.innerHTML = users.slice(start, start + PAGE_SIZE).map(rowTemplate).join('');
};

export const renderPagination = (usersCount, currentPage) => {
  const pagesCount = Math.ceil(usersCount / PAGE_SIZE);
  const items = [];

  for (let page = 1; page <= pagesCount; page += 1) {
    items.push(page === currentPage
      ? `<span class="pagination__item pagination__item--current">${page}</span>`
      : `<button class="pagination__item" type="button" data-page="${page}">${page}</button>`);
  }

  document.getElementById('stats-pagination').innerHTML = items.join('');
};

export const renderSortHeaders = (field, order) => {
  document.querySelectorAll('th[data-sort]').forEach((header) => {
    header.classList.remove('is-asc', 'is-desc');
    if (header.dataset.sort === field) {
      header.classList.add(order === 'asc' ? 'is-asc' : 'is-desc');
    }
  });
};

export const renderCountryOptions = (users) => {
  const select = document.getElementById('f-country');
  const selected = select.value;
  const countries = [...new Set(users.map((user) => user.country))].filter(Boolean).sort();
  const options = countries
    .map((country) => `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`)
    .join('');

  select.innerHTML = `<option value="">All</option>${options}`;
  select.value = selected;
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
  document.getElementById('info-location').textContent = [user.city, user.country]
    .filter(Boolean)
    .join(', ');
  document.getElementById('info-age').textContent = `${age}${capitalize(user.gender)}`;
  document.getElementById('info-phone').textContent = user.phone || '';
  document.getElementById('info-note').textContent = user.note || '';

  email.textContent = user.email || '';
  email.href = user.email ? `mailto:${user.email}` : '#teacher-info';

  star.classList.toggle('teacher-info__star--active', user.favorite);
};
