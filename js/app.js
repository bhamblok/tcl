let autoReload = '120s';
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
const query = window.location.search.replace('?', '').split('&').reduce((prev, next) => {
  const values = next.split('=');
  prev[values[0]] = isNaN(values[1])?values[1]:parseFloat(values[1]);
  return prev;
}, {});
const DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten'];
let TODAY = Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()/1000);
if (query.date) {
  TODAY = Math.round(new Date(query.date.split('-')[0], query.date.split('-')[1] - 1, query.date.split('-')[2]).getTime()/1000);
}
const startDate = TODAY - (60*60*24)*1;
const endDate = TODAY + (60*60*24)*6;
const DAY = DAYSOFWEEK[query.day || 1];
const DOKTRANSPORTEN = query.day === 6;
let XMLString = '';

let url = `http://192.168.16.11:8980/REST_PLAN_TCAN/rest/REST_PLAN_TCANService/api/v1/requestplanning?from=${startDate}&till=${endDate}`;
if (query.date && location.hostname === 'localhost') {
  url = '/api/v1/data/test.xml';
  autoReload = '';
}

// INIT
function init() {
  // ADD HEADER TITLE
  const header = document.querySelector('tcl-header');
  header.removeAttribute('autoreload');
  header.setAttribute('title', DAY);
  
  console.info(`Fetching data from: ${url}`);

  // transform xmlString to xml
  function xmlString_to_xml(xml) {
    return (new window.DOMParser()).parseFromString(utf8_for_xml(xml), "application/xml");
  }
  // utf8 for xml
  function utf8_for_xml(str) {
    return str.replace(/[^\x09\x0A\x0D\x20-\xFF\x85\xA0-\uD7FF\uE000-\uFDCF\uFDE0-\uFFFD]/gm, '');
  }
  // FETCH THE DATA
  function getData(url) {
    return fetch(url)
      .then(res => res.text());
      // .then(str => (new window.DOMParser()).parseFromString(utf8_for_xml(str), "application/xml"));
  }
  // TRANSFORM THE DOCS
  Promise.all([
    getData(url),
    getData('xsl/tcl.xsl')
  ]).then(([xml, xsl]) => {
    XMLString = xml;
    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xmlString_to_xml(xsl));
    const resultDocument = xsltProcessor.transformToDocument(xmlString_to_xml(xml), document);
    if (resultDocument) {
      // CLEAR EXISTING DATA
      [...document.querySelectorAll('tcl-row, tcl-col')].forEach((el) => {
        document.body.removeChild(el);
      });
      document.body.classList.add('loading')      
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
        [...resultDocument.querySelectorAll('ttplanning')].forEach((cardData) => {
          new TclCard(cardData);
        });
        document.body.classList.remove('loading')
        if (autoReload) header.setAttribute('autoreload', autoReload);
      }, 60);
    }
  });
}

const baseUri = document.createElement('base');
baseUri.href = window.document.baseURI.split('?')[0];
document.head.prepend(baseUri);

window.addEventListener('load', init);
if (autoReload) document.addEventListener('reload', init);

// LIVERELOAD IN DEV MODE
if (location.hostname === 'localhost' && location.port === '8001') {
  window.addEventListener('load', (e) => {
    const livereloadScriptEl = document.createElement('script');
    livereloadScriptEl.src = 'http://localhost:3335/livereload.js?snipver=1';
    livereloadScriptEl.async = true;
    document.body.appendChild(livereloadScriptEl);
  });
}

