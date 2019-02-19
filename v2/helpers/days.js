import QUERY from './query.js';

const now = new Date();

export const DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten', 'doktransporten'];

export const TODAY = QUERY.date
  ? Math.round(new Date(QUERY.date).getTime()/1000)
  : Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000);

export const DAY = DAYSOFWEEK[QUERY.day || (QUERY.dok + 5) || 1];

export const SCREEN = { DAY };