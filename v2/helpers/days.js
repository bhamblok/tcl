import QUERY from './query.js';

export const DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten', 'doktransporten'];

export const DAY = DAYSOFWEEK[QUERY.day || (QUERY.dok + 5) || 1];

export const SCREEN = { DAY };