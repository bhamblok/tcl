
const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', ];
const query = window.location.search.replace('?', '').split('&').reduce((prev, next) => {
  const values = next.split('=');
  prev[values[0]] = isNaN(values[1])?values[1]:parseFloat(values[1]);
  return prev;
}, {});
day = daysOfWeek[query.day || 1];

// INIT
function init() {
  document.querySelector('tcl-header').setAttribute('title', day);
  if (query.day !== undefined) {        
    let url = 'http://192.168.16.11:8980/REST_PLAN_TCAN/rest/REST_PLAN_TCANService/api/v1/requestplanning?from=1495404000&till=1496008800';
    url = './xml/test.xml';
    fetch(url).then((res) => {
      return res.text();
    }).then((xml) => {
      console.log('fetch result:', xml.substr(87, 80), '...');
    });
  }
}

window.addEventListener('load', init);