import sort from '../components/sort.js';
import TclCard from '../components/card/card.js';
import QUERY from './query.js';

export default (xml) => {
  ['OP TE HALEN', 'TE LADEN', 'TE LOSSEN', 'GELADEN', 'GELOST'].forEach((dok) => {
    const row = document.createElement('tcl-row');
    row.setAttribute('dok', dok);
    document.body.appendChild(row);
  });
  // FILL THE ROW WITH CARDS
  setTimeout(() => {
    [...xml.querySelectorAll('ttplanning')].forEach((cardData) => {
      new TclCard(cardData, 'DOK');
    });
    // Sort dictionary by its Key
    sort([... document.querySelectorAll('tcl-row tcl-row[groupby]')], 'groupby');

    // add a gap before the first "ziekte/verlof/economisch werkloos"
    document.querySelectorAll('body > tcl-row[dok]').forEach((dok) => {
      const firstFictive = dok.querySelector('tcl-row[groupby^="zzz_fictive_unloaded_date_"]');
      if (firstFictive) firstFictive.setAttribute('gap', true);
    });

    // DOK SCREEN 1
    if (QUERY.dok === 1) {
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const removeRows = [];
        [...document.querySelectorAll('body tcl-row tcl-row') || []].forEach((row) => {
          if (row.parentNode.offsetTop + row.offsetTop + row.offsetHeight > windowHeight) {
            removeRows.push(row);
          }
        });
        removeRows.forEach(row => row.parentNode.removeChild(row));
        [...document.querySelectorAll('body > tcl-row') || []].forEach((row) => {
          if (row.offsetTop + row.offsetHeight > windowHeight) {
            row.parentNode.removeChild(row);
          }
        });
      }, 100);
    }
    // DOK SCREEN 2
    if (QUERY.dok === 2) {
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const removeRows = [];
        [...document.querySelectorAll('body tcl-row tcl-row') || []].forEach((row) => {
          const parent = row.parentNode;
          if ((parent.offsetTop + parent.offsetHeight < windowHeight) && (removeRows.indexOf(parent) === -1)) {
            removeRows.push(parent);
          } else if (parent.offsetTop + row.offsetTop + row.offsetHeight < windowHeight) {
            removeRows.push(row);
          }
        });
        removeRows.forEach(row => row.parentNode.removeChild(row));
      }, 100);
    }
  }, 60);
}
