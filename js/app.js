const autoReload = false;
const TRUCKS = [
  '121',
  '123',
  '124',
  '125',
  '126',
  '127',
  '128',
  '129',
  '130',
  '131',
  '133',
  '134',
  '135',
  '136',
  '137',
  '138',
  '139',
  '140',
  '141',
  '142',
  '143',
  '144',
  '145',
  '146',
  '147',
  '148',
  '149',
  '150'
];
const DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten'];
const today = Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()/1000);
// today = 1488153600; // 27/02/2017
// today = 1494979200; // 17/05/2017
const startDate = today - (60*60*24)*1;
const endDate = today + (60*60*24)*6;
const query = window.location.search.replace('?', '').split('&').reduce((prev, next) => {
  const values = next.split('=');
  prev[values[0]] = isNaN(values[1])?values[1]:parseFloat(values[1]);
  return prev;
}, {});
const DAY = DAYSOFWEEK[query.day || 1];
const DOKTRANSPORTEN = query.day === 6;

let url = `http://192.168.16.11:8980/REST_PLAN_TCAN/rest/REST_PLAN_TCANService/api/v1/requestplanning?from=${startDate}&till=${endDate}`;
// url = '/api/v1/data/test.xml';

// INIT
function init() {
  console.info(`Fetching data from: ${url}`);

  // ADD HEADER TITLE
  document.querySelector('tcl-header').setAttribute('title', DAY);

  // FETCH THE DATA
  function getData(url) {
    function utf8_for_xml(str) {
      return str.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
    }
    return fetch(url)
      .then(res => res.text())
      .then(str => (new window.DOMParser()).parseFromString(utf8_for_xml(str), "application/xml"));
  }
  // TRANSFORM THE DOCS
  Promise.all([
    getData(url),
    getData('/xsl/tcl.xsl')
  ]).then(([xml, xsl]) => {
    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    const resultDocument = xsltProcessor.transformToDocument(xml,document);
    // CLEAR EXISTING DATA
    [...document.querySelectorAll('tcl-row, tcl-col')].forEach((el) => {
      document.body.removeChild(el);
    });
    // CREATE DEFAULT TRUCKS && COLUMNS
    if (!DOKTRANSPORTEN) {
      let col = document.createElement('tcl-col');
      col.setAttribute('number', 2);
      document.body.appendChild(col);
      col = document.createElement('tcl-col');
      col.setAttribute('number', 1);
      document.body.appendChild(col);
      TRUCKS.forEach((truck) => {
        const row = document.createElement('tcl-row');
        row.setAttribute('truck', truck);
        document.body.appendChild(row);
      });
    }
    // FILL THE ROW WITH CARDS
    setTimeout(() => {
      window.tmp = resultDocument;
      [...resultDocument.querySelectorAll('ttplanning')].forEach((cardData) => {
        new TclCard(cardData);
      });
    }, 60);
  });
}

window.addEventListener('load', init);
if (autoReload) document.addEventListener('timer', init);

// LIVERELOAD IN DEV MODE
if (location.hostname === 'localhost' && location.port === '8001') {
  window.addEventListener('load', (e) => {
    const livereloadScriptEl = document.createElement('script');
    livereloadScriptEl.src = 'http://localhost:3335/livereload.js?snipver=1';
    livereloadScriptEl.async = true;
    document.body.appendChild(livereloadScriptEl);
  });
}

