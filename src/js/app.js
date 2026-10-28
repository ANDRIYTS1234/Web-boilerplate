import '../scss/style.scss';
import { randomUserMock, additionalUsers } from './mock';
import formatUsers from './format-users';
import initPage from './page';

initPage(formatUsers(randomUserMock, additionalUsers));
