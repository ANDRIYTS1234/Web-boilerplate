import WebDataRocks from '@webdatarocks/webdatarocks';
import _ from 'lodash';
import { capitalize } from './utils';

const FLAT_COLUMNS = ['Name', 'Speciality', 'Age', 'Gender', 'Country', 'City', 'Email', 'Phone'];

let pivot = null;

const toReportRow = (user) => ({
  Name: user.full_name,
  Speciality: user.course,
  Age: user.age,
  Gender: capitalize(user.gender),
  Country: user.country,
  City: user.city,
  Email: user.email,
  Phone: user.phone,
});

const countriesSlice = {
  rows: [{ uniqueName: 'Country' }],
  columns: [{ uniqueName: 'Measures' }],
  measures: [
    { uniqueName: 'Teachers', formula: 'count("Name")', caption: 'Teachers' },
    { uniqueName: 'Average age', formula: 'average("Age")', caption: 'Average age' },
  ],
};

const flatSlice = {
  rows: _.map(FLAT_COLUMNS, (column) => ({ uniqueName: column })),
};

const renderReport = (users, type) => {
  const report = {
    dataSource: { data: _.map(users, toReportRow) },
    slice: type === 'flat' ? flatSlice : countriesSlice,
    options: {
      grid: {
        type: type === 'flat' ? 'flat' : 'compact',
        showGrandTotals: type === 'flat' ? 'off' : 'rows',
      },
    },
    formats: [{ name: '', decimalPlaces: 0 }],
  };

  if (!pivot) {
    pivot = new WebDataRocks({
      container: '#stats-report',
      toolbar: false,
      height: 450,
      report,
    });
    return;
  }

  pivot.setReport(report);
};

export default renderReport;
