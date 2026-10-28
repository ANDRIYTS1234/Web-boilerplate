const USERS_URL = 'https://randomuser.me/api/';
const TEACHERS_URL = 'http://localhost:3000/teachers';
const SEED = 'teachinder';

const checkResponse = (response) => {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchUsers = (count, page) => fetch(`${USERS_URL}?results=${count}&page=${page}&seed=${SEED}`)
  .then(checkResponse)
  .then((data) => data.results);

export const saveTeacher = (teacher) => fetch(TEACHERS_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(teacher),
}).then(checkResponse);
