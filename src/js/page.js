import formatUsers from './format-users';
import filterUsers from './filter-users';
import sortUsers from './sort-users';
import { searchUsers } from './find-user';
import getMatchPercent from './match-percent';
import { getUserFromForm, validateNewUser } from './teacher-form';
import { fetchUsers, saveTeacher } from './api';
import renderChart from './stats-chart';
import renderReport from './report';
import { toggleMap, hideMap } from './map';
import { INITIAL_USERS_COUNT, PAGE_SIZE } from './constants';
import {
  renderTeachers,
  renderFavorites,
  renderCountryOptions,
  renderTeacherInfo,
  renderMessage,
  renderStatsCount,
  renderStatsView,
} from './render';

const state = {
  users: [],
  filters: {},
  onlyWithPhoto: false,
  search: '',
  selectedId: null,
  statsView: 'chart',
  chartGroup: 'course',
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

const renderStats = (visibleUsers) => {
  renderStatsView(state.statsView);

  if (state.statsView === 'chart') {
    renderChart(visibleUsers, state.chartGroup);
  } else {
    renderReport(sortUsers(state.users, 'full_name'), state.statsView);
  }
};

const render = () => {
  const visibleUsers = getVisibleUsers();

  renderTeachers(visibleUsers);
  renderFavorites(state.users.filter((user) => user.favorite));
  renderStatsCount(
    visibleUsers.length,
    state.users.length,
    getMatchPercent(state.users, (user) => visibleUsers.includes(user)),
  );
  renderStats(visibleUsers);
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
  hideMap();
  renderTeacherInfo(findUserById(id));
  window.location.hash = 'teacher-info';
};

const scrollFavorites = (arrow) => {
  const step = arrow.classList.contains('slider__arrow--next') ? 200 : -200;
  document.getElementById('favorites-list').scrollBy({ left: step, behavior: 'smooth' });
};

const handleMainClick = (event) => {
  const card = event.target.closest('[data-id]');
  const viewButton = event.target.closest('[data-view]');
  const arrow = event.target.closest('.slider__arrow');
  const loadButton = event.target.closest('#load-more');

  if (card) {
    openTeacherInfo(card.dataset.id);
  }
  if (viewButton) {
    state.statsView = viewButton.dataset.view;
    renderStats(getVisibleUsers());
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
  render();
};

const handleMainChange = (event) => {
  if (event.target.id === 'chart-group') {
    state.chartGroup = event.target.value;
    renderStats(getVisibleUsers());
  }
  if (event.target.closest('#filters')) {
    handleFiltersChange();
  }
};

const handleSearch = (event) => {
  event.preventDefault();
  const query = document.getElementById('search-form').elements.search.value.trim();

  state.search = /^\d+$/.test(query) ? Number(query) : query;
  render();
};

const handleInfoClick = (event) => {
  const user = findUserById(state.selectedId);
  if (!user) return;

  if (event.target.closest('#info-star')) {
    user.favorite = !user.favorite;
    renderTeacherInfo(user);
    render();
  }
  if (event.target.closest('#info-map-toggle')) {
    event.preventDefault();
    toggleMap(user.coordinates);
  }
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

  const main = document.querySelector('main');
  main.addEventListener('click', handleMainClick);
  main.addEventListener('change', handleMainChange);
  document.getElementById('search-form').addEventListener('submit', handleSearch);
  document.getElementById('teacher-info').addEventListener('click', handleInfoClick);
  document.getElementById('add-teacher-form').addEventListener('submit', handleAddTeacher);
};

export default initPage;
