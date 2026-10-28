import formatUsers from './format-users';
import filterUsers from './filter-users';
import sortUsers from './sort-users';
import { searchUsers } from './find-user';
import getMatchPercent from './match-percent';
import { getUserFromForm, validateNewUser } from './teacher-form';
import { fetchUsers, saveTeacher } from './api';
import { INITIAL_USERS_COUNT, PAGE_SIZE } from './constants';
import {
  renderTeachers,
  renderFavorites,
  renderTable,
  renderPagination,
  renderSortHeaders,
  renderCountryOptions,
  renderTeacherInfo,
  renderMessage,
  renderStatsCount,
} from './render';

const state = {
  users: [],
  filters: {},
  onlyWithPhoto: false,
  search: '',
  sortField: 'full_name',
  sortOrder: 'asc',
  page: 1,
  selectedId: null,
  nextApiPage: INITIAL_USERS_COUNT / PAGE_SIZE + 1,
};

const parseAge = (value) => {
  if (!value) return undefined;
  const [min, max] = value.split('-').map(Number);
  return { min, max };
};

const findUserById = (id) => state.users.find((user) => user.id === id);

const getVisibleUsers = () => {
  let users = filterUsers(state.users, state.filters);

  if (state.onlyWithPhoto) {
    users = users.filter((user) => user.picture_large);
  }
  if (state.search !== '') {
    users = searchUsers(users, state.search);
  }

  return users;
};

const render = () => {
  const visibleUsers = getVisibleUsers();
  const sortedUsers = sortUsers(visibleUsers, state.sortField, state.sortOrder);

  renderTeachers(visibleUsers);
  renderTable(sortedUsers, state.page);
  renderPagination(sortedUsers.length, state.page);
  renderSortHeaders(state.sortField, state.sortOrder);
  renderFavorites(state.users.filter((user) => user.favorite));
  renderStatsCount(
    visibleUsers.length,
    state.users.length,
    getMatchPercent(state.users, (user) => visibleUsers.includes(user)),
  );
};

const addUsers = (users) => {
  state.users = state.users.concat(users);
  renderCountryOptions(state.users);
  render();
};

const loadMoreUsers = () => {
  const button = document.getElementById('load-more');
  button.disabled = true;

  fetchUsers(PAGE_SIZE, state.nextApiPage)
    .then((results) => {
      state.nextApiPage += 1;
      button.textContent = 'Next';
      addUsers(formatUsers(results));
    })
    .catch(() => {
      button.textContent = 'Try again';
    })
    .finally(() => {
      button.disabled = false;
    });
};

const openTeacherInfo = (id) => {
  state.selectedId = id;
  renderTeacherInfo(findUserById(id));
  window.location.hash = 'teacher-info';
};

const changeSort = (field) => {
  if (state.sortField === field) {
    state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    state.sortField = field;
    state.sortOrder = 'asc';
  }
  state.page = 1;
  render();
};

const scrollFavorites = (arrow) => {
  const step = arrow.classList.contains('slider__arrow--next') ? 200 : -200;
  document.getElementById('favorites-list').scrollBy({ left: step, behavior: 'smooth' });
};

const handleMainClick = (event) => {
  const card = event.target.closest('[data-id]');
  const header = event.target.closest('th[data-sort]');
  const pageButton = event.target.closest('[data-page]');
  const arrow = event.target.closest('.slider__arrow');
  const loadButton = event.target.closest('#load-more');

  if (card) {
    openTeacherInfo(card.dataset.id);
  }
  if (header) {
    changeSort(header.dataset.sort);
  }
  if (pageButton) {
    state.page = Number(pageButton.dataset.page);
    render();
  }
  if (arrow) {
    scrollFavorites(arrow);
  }
  if (loadButton) {
    loadMoreUsers();
  }
};

const handleFiltersChange = () => {
  const form = document.getElementById('filters');

  state.filters = {
    country: form.elements.country.value || undefined,
    gender: form.elements.gender.value || undefined,
    age: parseAge(form.elements.age.value),
    favorite: form.elements.favorite.checked ? true : undefined,
  };
  state.onlyWithPhoto = form.elements.photo.checked;
  state.page = 1;
  render();
};

const handleSearch = (event) => {
  event.preventDefault();
  const query = document.getElementById('search-form').elements.search.value.trim();

  state.search = /^\d+$/.test(query) ? Number(query) : query;
  state.page = 1;
  render();
};

const handleStarClick = () => {
  const user = findUserById(state.selectedId);
  if (!user) return;

  user.favorite = !user.favorite;
  renderTeacherInfo(user);
  render();
};

const handleAddTeacher = (event) => {
  event.preventDefault();
  const form = document.getElementById('add-teacher-form');
  const errorsBox = document.getElementById('form-errors');
  const user = getUserFromForm(form);
  const errors = validateNewUser(user);

  if (errors.length > 0) {
    errorsBox.textContent = errors.join(' ');
    return;
  }

  saveTeacher(user)
    .then(() => {
      errorsBox.textContent = '';
      form.reset();
      addUsers([user]);
      window.location.hash = 'teachers';
    })
    .catch(() => {
      errorsBox.textContent = 'Could not save the teacher. Start the server with "npm run server".';
    });
};

const initPage = () => {
  renderMessage('Loading teachers...');

  fetchUsers(INITIAL_USERS_COUNT, 1)
    .then((results) => addUsers(formatUsers(results)))
    .catch(() => renderMessage('Could not load teachers. Try again later.'));

  document.querySelector('main').addEventListener('click', handleMainClick);
  document.getElementById('filters').addEventListener('change', handleFiltersChange);
  document.getElementById('search-form').addEventListener('submit', handleSearch);
  document.getElementById('info-star').addEventListener('click', handleStarClick);
  document.getElementById('add-teacher-form').addEventListener('submit', handleAddTeacher);
};

export default initPage;
