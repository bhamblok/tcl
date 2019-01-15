import sort from '../sort.js';
import TclCard from '../card/card.js';

const DEFAULT_TRUCKS = ['121', '123', '124', '125', '126', '127', '128', '129', '130', '131', '133', '134', '135', '136', '137', '138', '139', '140', '141', '142', '143', '144', '145', '146', '147', '148', '149', '150', '151', '152', '153', '154'];

// GET TRUCKS
function getTrucks(xml) {
  const dynamicTrucks = [...xml.querySelectorAll('ttTruck Truck_name')].map(truck => truck.textContent);
  if (dynamicTrucks.length) {
    return dynamicTrucks.filter(truck => ![ "TCL", "RESERVATIE", "PARKING", "GARAGE", "TESTPT2"].includes(truck));
  }
  return DEFAULT_TRUCKS;
}

export default ({ xml, query }) => {
  let col = document.createElement('tcl-col');
  col.setAttribute('number', 2);
  document.body.appendChild(col);
  col = document.createElement('tcl-col');
  col.setAttribute('number', 1);
  document.body.appendChild(col);

  const TRUCKS = getTrucks(xml);
  TRUCKS.forEach((truck) => {
    const row = document.createElement('tcl-row');
    row.setAttribute('truck', truck);
    row.setAttribute('groupby', truck);
    document.body.appendChild(row);
  });

  // FILL THE ROW WITH CARDS
  setTimeout(() => {
    [...xml.querySelectorAll('ttplanning')].forEach((cardData) => {
      new TclCard(cardData, 'DAY', xml, query);
    });

    // FINALIZE RENDERING (SORTING & SPACING)
    // hide duplicate cards
    [... document.querySelectorAll('tcl-row tcl-card')].forEach((card) => {
      const cards = [... card.parentNode.querySelectorAll(`[uid="${card.uid}"]`)];
      if (cards.length > 1) {
        cards.forEach((c, i) => {
          if (c !== card) {
            // give priority to PROG instead of PLAN
            // TODO: MOVE FUNCTION TO CARD
            if ((card.STATUSCODE === 'PROG' && c.STATUSCODE === 'PLAN') ||
              (card.STATUSCODE !== 'PROG' && c.STATUSCODE !== 'PROG' && i !== 0)) {
              // visualise CHUB instead of PROG
              if (c.actionFromQparCHUB) {
                card.style.display = 'none';
                if (card.actionToQparCHUB) {
                  c.root.querySelector('.turnin-name').textContent = card.Action_To_Alias || card.Action_To;
                }
              } else {
                c.style.display = 'none';
                if (c.actionToQparCHUB) {
                  card.root.querySelector('.turnin-name').textContent = c.Action_To_Alias || c.Action_To;
                }
              }
            }
          }
        });
      }
    });
    // sort rows
    sort([... document.querySelectorAll('tcl-row')], 'groupby');
    // add a gap before the first charter
    const firstCharter = document.querySelector('tcl-row[chauffeur^="CHARTER"]');
    if (firstCharter) firstCharter.setAttribute('gap', true);
    // move "HUB" to the bottom
    [... document.querySelectorAll('tcl-row[groupby^="HUB"]')].forEach(row => row.parentNode.appendChild(row));
    const firstHub = document.querySelector('tcl-row[groupby^="HUB"]');
    if (firstHub) firstHub.setAttribute('gap', true);
    // move "ziekte/verlof/economisch werkloos back to the bottom"
    [... document.querySelectorAll('tcl-row[truck="null"]')].forEach(row => row.parentNode.appendChild(row));
    // add a gap before the first "ziekte/verlof/economisch werkloos"
    const firstOther = document.querySelector('tcl-row[truck="null"]');
    if (firstOther) firstOther.setAttribute('gap', true);
    
    // sort cards in "eerste/tweede werk"
    sort([... document.querySelectorAll('tcl-col[number="1"] tcl-card')], 'destination', 'sortedTime');
    sort([... document.querySelectorAll('tcl-col[number="2"] tcl-card')], 'destination', 'sortedTime');
    // show some space in "eerste/tweede werk" to indicate available trucks
    const emptyRows = document.querySelectorAll('tcl-row:empty').length;
    [... document.querySelectorAll(`tcl-col tcl-card:nth-of-type(${emptyRows + 1})`)].forEach((card) => {
      card.setAttribute('gap', true);
    });
  }, 60);
}
