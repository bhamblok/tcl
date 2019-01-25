import QUERY from './query.js';

const now = new Date();

export const DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten', 'doktransporten'];

const dateArray = (QUERY.date || []).split('-');

export const TODAY = QUERY.date
  ? Math.round(new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).getTime()/1000)
  : Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000);

export const DAY = DAYSOFWEEK[QUERY.day || (QUERY.dok + 5) || 1];

export const SCREEN = { DAY };