
const QUERY = window.location.search.replace('?', '').split('&').reduce((prev, next) => {
  const values = next.split('=');
  prev[values[0]] = isNaN(values[1])?values[1]:parseFloat(values[1]);
  return prev;
}, {});

export default QUERY;