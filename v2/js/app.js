import '../components/index.js';
import createDay from '../helpers/day.js';
import createDoktransporten from '../helpers/doktransporten.js';
import QUERY from '../helpers/query.js';
import clearDocument from '../helpers/clearDocument.js';
import { DAY } from '../helpers/days.js';

let autoReload = '120s';
let refreshThreshold = 0;

// INIT
function init() {
  if (++refreshThreshold > 30) {
    window.location.reload();
  }
  const now = new Date();
  window.TODAY = QUERY.date
    ? Math.round(new Date(QUERY.date).getTime()/1000)
    : Math.round(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()/1000);
  const startDate = window.TODAY - (60 * 60 * 24) * 1;
  const endDate = window.TODAY + (60 * 60 * 24) * 6;
  let url = `http://192.168.16.15:8980/REST_PLAN_TCAN/rest/REST_PLAN_TCANService/api/v1/requestplanning?from=${startDate}&till=${endDate}`;
  if (QUERY.date && location.hostname === 'localhost') {
    url = '/api/v1/data/test.xml';
    autoReload = '';
  }
  
  // ADD HEADER TITLE
  const header = document.querySelector('tcl-header');
  header.removeAttribute('autoreload');
  
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
    window.XMLString = xml;
    const xsltProcessor = new window.XSLTProcessor();
    xsltProcessor.importStylesheet(xmlString_to_xml(xsl));
    const resultDocument = xsltProcessor.transformToDocument(xmlString_to_xml(xml), document);
    if (resultDocument) {
      clearDocument();
      if (autoReload) header.setAttribute('autoreload', autoReload);

      // CREATE DEFAULT TRUCKS && COLUMNS
      if (!QUERY.dok) {
        createDay(resultDocument);
      // CREATE DOK SECTIONS
      } else {
        header.setAttribute('title', DAY);
        createDoktransporten(resultDocument);
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

