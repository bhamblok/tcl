import '../components/index.js';
import createDay from '../components/day/day.js';
import createDoktransporten from '../components/doktransporten/doktransporten.js';

let autoReload = '120s';
const query = window.location.search.replace('?', '').split('&').reduce((prev, next) => {
  const values = next.split('=');
  prev[values[0]] = isNaN(values[1])?values[1]:parseFloat(values[1]);
  return prev;
}, {});
window.DAYSOFWEEK = ['none', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'doktransporten', 'doktransporten'];
window.TODAY = Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()/1000);
window.DAY = DAYSOFWEEK[query.day || query.screen || (query.dok + 5) || 1];
window.DOKTRANSPORTEN = query.dok === 1 || query.dok === 2;

// INIT
function init() {
  window.TODAY = Math.round(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()/1000);
  if (query.date) {
    window.TODAY = Math.round(new Date(query.date.split('-')[0], query.date.split('-')[1] - 1, query.date.split('-')[2]).getTime()/1000);
  }
  const startDate = window.TODAY - (60 * 60 * 24) * 1;
  const endDate = window.TODAY + (60 * 60 * 24) * 6;
  let url = `http://192.168.16.15:8980/REST_PLAN_TCAN/rest/REST_PLAN_TCANService/api/v1/requestplanning?from=${startDate}&till=${endDate}`;
  if (query.date && location.hostname === 'localhost') {
    url = '/api/v1/data/test.xml';
    autoReload = '';
  }
  
  // ADD HEADER TITLE
  const header = document.querySelector('tcl-header');
  header.removeAttribute('autoreload');
  header.setAttribute('title', window.DAY);
  
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
  }

  // TRANSFORM THE DOCS
  Promise.all([
    getData(url),
    getData('./xsl/tcl.xsl')
  ]).then(([xml, xsl]) => {
    const XMLString = xml;
    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xmlString_to_xml(xsl));
    const resultDocument = xsltProcessor.transformToDocument(xmlString_to_xml(xml), document);
    if (resultDocument) {
      // CLEAR EXISTING DATA
      [...document.querySelectorAll('body > tcl-day, body > tcl-row, body > tcl-col')].forEach((el) => {
        document.body.removeChild(el);
      });
      document.body.classList.remove('loading')
      if (autoReload) header.setAttribute('autoreload', autoReload);

      // CREATE DEFAULT TRUCKS && COLUMNS
      if (!window.DOKTRANSPORTEN) {
        createDay({ xml: resultDocument, query });
      // CREATE DOK SECTIONS
      } else {
        createDoktransporten({ xml: resultDocument, query });
      }
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

