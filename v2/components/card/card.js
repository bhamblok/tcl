import template from './card-template.js';
import QUERY from '../../helpers/query.js';
import { DAYSOFWEEK, SCREEN } from '../../helpers/days.js';

export default class TclCard extends HTMLElement {
  // ************* CONSTRUCTOR + CUSTOM ELEMENT ************
  static get observedAttributes() {
    return ['tstamp'];
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this[attrName] = newVal;
    }
  }
  constructor(xml, type, fullXML) {
    super();
    if (fullXML) this.fullXML = fullXML;
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = template;
    this.xml = xml;
    this.type = type;
    this.tstamp = this.tstamp;
    this.Container_size_code = this.Container_size_code;
    if(this.Container_wedergebruik || this.Container_wachtzone) {
      this.classList.add('shaded');
    }
        
    if (this.showUpInDayPlanningRows) {
      let row = document.querySelector(`tcl-row[groupby="${this.groupBy}"][chauffeur="${this.CHAUFFEUR}"]`);
      if (!row) {
        row = document.querySelector(`tcl-row[groupby="${this.groupBy}"]:not([chauffeur])`);
      }
      if (['VERLOF', 'ZIEKTE', 'ECONOMISCH WERKLOOS'].includes(this.ACTIVITEIT)) {
        if (this.truck) {
          row = document.querySelector(`tcl-row[truck="${this.truck}"]`);
        } else {
          row = document.querySelector(`tcl-row[groupby="${this.groupBy}"]`);
        }
      }
      let parentForRow = document.body;
      const day = (new Date(this.Date_active)).getDay();
      if (day > 5) {
        const dayOfWeek = day === 6 ? 'ZATERDAG' : 'ZONDAG';
        parentForRow = document.querySelector(`tcl-row[dok="${dayOfWeek}"]`);
        if (!parentForRow) {
          parentForRow = document.createElement('tcl-row');
          parentForRow.setAttribute('dok', dayOfWeek);
          document.body.appendChild(parentForRow);
        }
      }

      if (!row) {
        row = document.createElement('tcl-row');
        row.setAttribute('truck', this.truck);
        row.setAttribute('groupby', this.groupBy);
        if (parentForRow !== document.body) {
          row.setAttribute('weekend', true);
        }
        parentForRow.appendChild(row);
      }
      row.setAttribute('chauffeur', this.CHAUFFEUR);
      row.appendChild(this);
      this.render();

    } else if(this.showUpInDayPlanningCols) {
      this.dayPlanningCols = true;
      let timereq = this.TIMEREQ;
      if (!isNaN(timereq)) {
        if(timereq/100>24) timereq = timereq/10000;
        else timereq = timereq/100;
      } else {
        console.log('NO VALID TIMEREQ (should be a number)', timereq)
      }
      if((this.PRIOR === 1 || this.PRIOR === 4) || (timereq > 0 && timereq < 12)) {
        const col = document.querySelector(`tcl-col[number="1"]`);
        if (col) col.appendChild(this);
      } else {
        const col = document.querySelector(`tcl-col[number="2"]`);
        if (col) col.appendChild(this);
      }
      this.render();
    } else if(this.showUpInDoktransporten) {
      this.type = this.STATUS2;

      let row = document.querySelector(`tcl-row[dok="${this.STATUS2}"] tcl-row[groupby="${this.groupBy}"]`);
      if (!row) {
        row = document.createElement('tcl-row');
        row.setAttribute('groupby', this.groupBy);
        row.setAttribute('dok', '');
        document.querySelector(`tcl-row[dok="${this.STATUS2}"]`).appendChild(row);
      }
      row.appendChild(this);

      this.render();
    }
  }
  render() {
    if(!['BAANTRANSPORT','DOKTRANSPORT'].includes(this.ACTIVITEIT)) {
      this.uid = Math.random().toString().replace('0.','');
    }
        
    if (['VERLOF', 'ZIEKTE', 'DOK', 'ECONOMISCH WERKLOOS'].includes(this.ACTIVITEIT)) {
      this.uid = this.CHAUFFEUR;
      this.root.querySelector('.activiteit').textContent = this.ACTIVITEIT;
      this.root.querySelector('.info').textContent = this.CHAUFFEUR;
      // sort verlof/ziekte cards (with flexbox order)
      this.style.order = this.ACTIVITEIT.charCodeAt(0) * 100 + this.CHAUFFEUR.charCodeAt(0);
    }
    else if (['GARAGE', 'PARKING'].includes(this.ACTIVITEIT)) {
      this.uid = this.Trailer_Fleet_Number;
      this.root.querySelector('.activiteit').textContent = this.ACTIVITEIT;
      this.root.querySelector('.info').textContent = this.Trailer_Fleet_Number;
    }
    else if (this.ACTIVITEIT === 'RESERVATIE') {
      this.sortTime = this.TIMEREQ;
      this.destination = this.ADRES;
      this.root.querySelector('.activiteit').textContent = 'RESERVATIE';
      this.root.querySelector('.info').textContent = this.CHAUFFEUR;
      this.root.querySelector('.direction').textContent = this.Direction;
      this.root.querySelector('.loading').textContent = [this.time, this.ADRES].join(' ').trim();
      this.root.querySelector('.size').textContent = `${this.Container_size_code}'`;
    }
    else {
      this.uid = this.Intermodal_Cargo_obj;

      if(this.PRIOR === 3) this.classList.add('prior');
      if(this.Alert !== '') this.classList.add('alert');
      if(this.ADR_Class !== '') this.classList.add('adr');
      if((/RE|45R1/ig).test(this.Container_ISO_Code)) this.classList.add('refrigerated');

      // containerHubs can change pickup-name
      let pickupName = this.Pickup_name || ' ';
      if(this.actionToQparCHUB || this.actionFromQparCHUB) {
        pickupName = this.Action_From_Alias || this.Action_From || pickupName;
      }
      this.root.querySelector('.pickup-name').textContent = pickupName;
      
      // containerHubs can change turnin-name
      let turninName = this.Turnin_name || ' ';
      if((this.actionToQparCHUB || this.actionFromQparCHUB) && !(this.actionFromQparCHUB && this.actionToEqualsUnLoading)) {
        turninName = this.Action_To_Alias || this.Action_To || turninName;
      }
      if(this.actionToQparCHUB && this.actionFromEqualsUnLoading) {
        turninName = this.Action_To_Alias || this.Action_To || turninName;
      }
      this.root.querySelector('.turnin-name').textContent = turninName;

      this.root.querySelector('.container-type').textContent = this.Container_ISO_Code || ' ';
      this.root.querySelector('.in-out-coming').textContent = this.free_until_date || ' ';
      this.root.querySelector('.in-out-coming2').textContent = this.detention_date || ' ';
      this.root.querySelector('.original-cargo-number').textContent = this.Intermodal_Cargo_Number || ' ';

      this.sortTime = this.TIMEREQ;
      this.destination = this.ADRES;
      if (this.ACTIVITEIT === 'BAANTRANSPORT') {
        if (this.Direction === 'OUTGOING') {
          this.destination = this.Loading_facility_location;
          if (this.type !== 'DAY' && this.Loading_Time) this.sortTime = this.Loading_Time;
        } else {
          this.destination = this.Unloading_facility_location;
          if (this.type !== 'DAY' && this.Unloading_Time) this.sortTime = this.Unloading_Time;
        }
      }
      if (this.ACTIVITEIT === 'DOKTRANSPORT') {
        if (this.Direction == 'OUTGOING') {
          this.destination = this.Loading_facility_name;
          if (this.type !== 'DAY' && this.Loading_Time) this.sortTime = this.Loading_Time;
        } else {
          this.destination = this.Unloading_facility_name;
          if (this.type !== 'DAY' && this.Unloading_Time) this.sortTime = this.Unloading_Time;
        }
      }
      this.root.querySelector('.avail-after-customs-ref').textContent = this.Avail_after_customs_ref || ' ';
      this.root.querySelector('.loading').textContent = (this.sortTime ? `${this.constructor.formatTime(this.sortTime)} ${this.destination}` : this.destination) || ' ';

      function convertDate(prefix, str) {
        if (str != '') {
          return `${prefix} ${str.split('-')[2]}/${str.split('-')[1]}`;
        }
        return ' ';
      }
			
      if (this.Direction === 'INCOMING') {
        if(this.type === 'TE LOSSEN' || this.type === 'GELOST') {
          this.root.querySelector('.in-out-coming').textContent = convertDate('Det.', this.detention_date);
        } else {
          this.root.querySelector('.in-out-coming').textContent = convertDate('Vrij', this.free_until_date);
        }
        this.root.querySelector('.in-out-coming2').textContent = convertDate('AMS', this.closing_date_ams);
      }
      if (this.Direction === 'OUTGOING') {
        this.root.querySelector('.in-out-coming').textContent = convertDate('Det.', this.detention_date);
			  this.root.querySelector('.in-out-coming2').textContent = convertDate('CLD', this.closing_date);
      }		

      if ((this.StatusEurotracs === "RECEIVED" || this.STATUSCODE === "PROG") && this.Trailer_Fleet_Number !== '') {
        this.root.querySelector('.trailer').innerHTML = `<tcl-marquee>${this.Trailer_Fleet_Number}</tcl-marquee>`;
      }

    }
    // sort cards (with flexbox order)
    if (!this.dayPlanningCols) {
      if (!isNaN(this.sortTime)) {
        if(this.sortTime>2400) this.sortTime = this.sortTime/100;
        this.style.order = this.sortTime + 3;
      } else if (['GARAGE', 'PARKING'].includes(this.ACTIVITEIT)) {
        this.style.order = 1;
      } else {
        this.style.order = 2;
      }
    }
  }
  static log(e) {
    console.log(e.target.closest('tcl-card').xml);
  }
  static formatTime(value) {
    let time = value/100;
    if(time > 24) time = time/100;
    return time.toFixed(2).replace('.','u').replace('u00', 'u');
  }
  connectedCallback() {
    if (location.port === '8001') {
      this.addEventListener('click', this.constructor.log);
    }
  }
  disconnectedCallback() {
    // clear everything
    if (location.port === '8001') {
      this.removeEventListener('click', this.constructor.log);
    }
  }

  // ************ type ************
  set type(val) {
    this._type = val;
    // get groupBy and sortBy properties
    switch(val) {
      case 'OP TE HALEN':
        this.uid = Math.random().toString().replace('0.','');        
        if(this.actionToQparCHUB || this.actionFromQparCHUB) {						
          this.groupBy = this.Action_From;
        } else {
          this.groupBy = this.Pickup_name;
        }
        break;
      case 'TE LADEN':
        this.uid = Math.random().toString().replace('0.','');
        this.groupBy = this.Loading_facility_name;
        break;
      case 'TE LOSSEN':
        this.uid = Math.random().toString().replace('0.','');
        this.groupBy = this.Unloading_facility_name;
        if (this.Fictive_unloaded_date) {
          this.groupBy = `zzz_fictive_unloaded_date_${this.groupBy}`;
        }
        break;
      case 'GELADEN':
        this.uid = Math.random().toString().replace('0.','');
        this.groupBy = this.Turnin_name;
        break;
      case 'GELOST':
        this.uid = Math.random().toString().replace('0.','');
        this.groupBy = this.Unloading_facility_name;
        if (this.Fictive_unloaded_date) {
          this.groupBy = `zzz_fictive_unloaded_date_${this.groupBy}`;
        }
        break;
      case 'CHASSIS':					
      case 'PARKING':
      case 'GARAGE':
        this.uid = Math.random().toString().replace('0.','');
        this.groupBy = this.ACTIVITEIT;
        break;
      default:
        if (['VERLOF', 'ZIEKTE', 'ECONOMISCH WERKLOOS'].includes(this.ACTIVITEIT)) {
          this.groupBy = this.ACTIVITEIT;
        } else {
          this.groupBy = this.truck;
        }
    }
  }
  get type() {
    return this._type;
  }
  // ************* uid **************
  set uid(val) {
    this._uid = val.replace('.','');
    this.setAttribute('uid', this._uid);
  }
  get uid() {
    return this._uid;
  }

  // ************* SHOW UP IN DAY PLANNING ****************
  get showUpInDayPlanningRows() {
    // ALL "NORMAL" CARDS
    return (this.checkDay &&
      (((this.charter || this.dok || (
        ['PLAN', 'PROG', 'NOTOP'].includes(this.STATUSCODE) &&
        [
          'BAANTRANSPORT',
          'DOKTRANSPORT',
          'VERLOF',
          'ZIEKTE',
          'GARAGE',
          'PARKING',
          'ANNULATIE',
          'ARBEIDSONGESCHIKT',
          'ARBEIDSONGEVAL',
          'ECONOMISCH WERKLOOS',
          'DOK'
        ].includes(this.ACTIVITEIT))
      ) && 
      !['FOUTVRACHT'].includes(this.STATUS2) &&
      !this.oldNOTOP &&
      (this.CHAUFFEUR || !['BAANTRANSPORT', 'DOKTRANSPORT'].includes(this.ACTIVITEIT)) &&
      (this.truck || !['GARAGE', 'PARKING'].includes(this.ACTIVITEIT))) ||
      // ALL "CHUB" CARDS
      (((['NEW', 'ACC'].includes(this.STATUSCODE) &&
      this.ACTIVITEIT === 'BAANTRANSPORT' &&
      ['OP TE HALEN', 'TE LADEN', 'TE LOSSEN', 'DOUANE'].includes(this.STATUS2)) ||
      this.STATUS2 === 'RESERVATIE') && 
      (!this.hideCustoms &&
      (this.Action_From_QPAR === 'CHUB' || this.Action_From_QPAR === 'CHUB2') &&
      this.Action_To_QPAR === 'TURNIN'))));
  }
  get showUpInDayPlanningCols() {
    return (this.checkDay &&
    ((['NEW', 'ACC'].includes(this.STATUSCODE) &&
      this.ACTIVITEIT === 'BAANTRANSPORT' &&
      ['OP TE HALEN', 'TE LADEN', 'TE LOSSEN', 'DOUANE'].includes(this.STATUS2)) ||
      this.STATUS2 === 'RESERVATIE') &&
      !this.hideCustoms);
  }
  get showUpInDoktransporten() {
    return (QUERY.dok && this.STATUSCODE !== 'REF' &&
      [
        'OP TE HALEN',
        'TE LADEN',
        'TE LOSSEN',
        'GELADEN',
        'GELOST'
      ].includes(this.STATUS2) &&
      ['DOKTRANSPORT', 'PARKING', 'GARAGE'].includes(this.ACTIVITEIT) &&
      (!['PARKING', 'GARAGE'].includes(this.ACTIVITEIT) || this.Trailer_Fleet_Number !== ''));
  }
  // ************* hideCustoms ************
  get hideCustoms() {
    // check if this card needs to be hidden because it is a duplicate for another card which needs to go to customs first
    function getTag(xml, tag) {
      const res = xml.querySelector(tag);
      if (res) return res.textContent.trim().toUpperCase();
      return null;
    }
    if(this.STATUS2 === 'OP TE HALEN' && (this.Customs_formalities_name || this.Scan_formalities_name)) {
      const Action_From = this.Action_From.replace(/[-\s]/ig, '');
      const Customs_formalities_name = this.Customs_formalities_name.replace(/[-\s]/ig, '');
      const Scan_formalities_name = this.Scan_formalities_name.replace(/[-\s]/ig, '');
      if (Action_From === (Customs_formalities_name || Scan_formalities_name)) {
        let counter = 0;
        [...this.fullXML.querySelectorAll('ttplanning')].forEach((item) => {
          if(getTag(item, 'Original_Cargo_Number') === this.Original_Cargo_Number && getTag(item, 'STATUS2') === 'OP TE HALEN') {
            counter++;
          }
        });
        if (counter > 1) {
          return true;
        }
      }
    }
    return false;
  }
  // ************* GET TAGS ***************
  getTag(tag) {
    if (this[`_${tag}`] === undefined) {
      const res = this.xml ? this.xml.querySelector(tag) : null;
      if (res) this[`_${tag}`] = res.textContent.trim().toUpperCase();
      else this[`_${tag}`] = null;
    }
    return this[`_${tag}`];
  }
  get Date_active() {
    return this.getTag('Date_active');
  }
  get TIMEREQ() {
    return this.getTag('TIMEREQ').replace(',','.');
  }
  get DATREQ() {
    return this.getTag('DATREQ').replace(',','.');
  }
  get Truck_Fleet_Number() {
    return this.getTag('Truck_Fleet_Number');
  }
  get Trailer_Fleet_Number() {
    return this.getTag('Trailer_Fleet_Number');
  }
  get STATUS2() {
    return this.getTag('STATUS2');
  }
  get STATUSCODE() {
    return this.getTag('STATUSCODE');
  }
  get ACTIVITEIT() {
    const activiteit = this.getTag('ACTIVITEIT');
    if (this.STATUS2 === 'DOK') {
      this._ACTIVITEIT = 'DOK';
    }
    if (this._ACTIVITEIT === '') this._ACTIVITEIT = 'PARKING';
    this.setAttribute('ACTIVITEIT', activiteit);
    return this._ACTIVITEIT;
  }
  get CHAUFFEUR() {
    this.getTag('CHAUFFEUR');
    this._CHAUFFEUR = [... new Set(this._CHAUFFEUR.split(' '))].join(' ');
    return this.getTag('CHAUFFEUR');
  }
  get Direction() {
    return this.getTag('Direction') === 'U' ? 'OUTGOING' : 'INCOMING';
  }
  get ADRES() {
    return this.getTag('ADRES');
  }
  get Container_size_code() {
    return parseInt(this.getTag('Container_size_code').split(' ')[0], 10);
  }
  get StatusEurotracs() {
    return this.getTag('StatusEurotracs');
  }
  get Container_wedergebruik() {
    return this.getTag('Container_wedergebruik') === 'FALSE' ? false : true;
  }
  get Container_wachtzone() {
    return this.getTag('Container_wachtzone') === 'FALSE' ? false : true;
  }
  get Container_ISO_Code() {
    return this.getTag('Container_ISO_Code');
  }
  get free_until_date() {
    return this.getTag('Free_until_date');
  }
  get detention_date() {
    return this.getTag('Detention_date');
  }
  get Intermodal_Cargo_Number() {
    const icn = this.getTag('Intermodal_Cargo_Number');
    if(icn.indexOf('TO BE NOMINATED')!==-1) return 'TBN';
    return icn;
  }
  get Intermodal_Cargo_obj() {
    return this.getTag('Intermodal_Cargo_obj');
  }
  get PRIOR() {
    return parseInt(this.getTag('PRIOR'), 10);
  }
  get Alert() {
    return this.getTag('Alert');
  }
  get Avail_after_customs_ref() {
    return this.getTag('Avail_after_customs_ref');
  }
  get Loading_facility_location() {
    return this.getTag('Loading_facility_location');
  }
  get Unloading_facility_location() {
    return this.getTag('Unloading_facility_location');
  }
  get Loading_facility_name() {
    return this.getTag('Loading_facility_name');
  }
  get Unloading_facility_name() {
    return this.getTag('Unloading_facility_name');
  }
  get closing_date() {
    return this.getTag('closing_date');
  }
  get closing_date_ams() {
    return this.getTag('closing_date_ams');
  }
  get Pickup_name() {
    return this.getTag('Pickup_name');
  }
  get Turnin_name() {
    return this.getTag('Turnin_name');
  }
  get Loading_Time() {
    return parseInt(this.getTag('Loading_Time'), 10) / 10000;
  }
  get Unloading_Time() {
    return parseInt(this.getTag('Unloading_Time'), 10) / 10000;
  }
  get Action_To() {
    return this.getTag('Action_To');
  }
  get Action_To_Alias() {
    return this.getTag('Action_To_Alias');
  }
  get Action_To_QPAR() {
    return this.getTag('Action_To_QPAR');
  }
  get Action_From() {
    return this.getTag('Action_From');
  }
  get Action_From_Alias() {
    return this.getTag('Action_From_Alias');
  }
  get Action_From_QPAR() {
    return this.getTag('Action_From_QPAR');
  }
  get Customs_formalities_name() {
    return this.getTag('Customs_formalities_name');
  }
  get Scan_formalities_name() {
    return this.getTag('Scan_formalities_name');
  }
  get Original_Cargo_Number() {
    return this.getTag('Original_Cargo_Number');
  }
  get ADR_Class() {
    return this.getTag('ADR_Class');
  }
  get Fictive_unloaded_date() {
    return this.getTag('Fictive_unloaded_date');
  }
  
  // ************* CHECK DAY ************
  get checkDay() {
    return SCREEN.DAY === DAYSOFWEEK[this.Date_active ? (new Date(this.Date_active)).getDay() : 0];
  }
  // ************* CHARTER ************
  get charter() {
    return ((/RESERVATIE/ig).test(this.STATUS2) && !(/RESERVATIE/ig).test(this.Truck_Fleet_Number));
  }
  // ************* DOK? ************
  get dok() {
    return (/DOK/ig).test(this.STATUS2);
  }
  // ************* TRUCK ************
  get truck() {
    if (this._truck === undefined) {
      if (this.Truck_Fleet_Number) {
        if (!isNaN(this.Truck_Fleet_Number.split(' ')[0])) {
          this._truck = this.Truck_Fleet_Number.split(' ')[0];
        } else {
          this._truck = this.Truck_Fleet_Number.replace(/[\[\]]/ig, '').trim();
        }
      } else {
        this._truck = null;
      }
      if (!this._truck && (this.Action_From_QPAR === 'CHUB' || this.Action_From_QPAR === 'CHUB2') && this.Action_To_QPAR === 'TURNIN') {
        this._truck = `HUB&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(${(this.Action_From_Alias || this.Action_From)})`;
        this._CHAUFFEUR = this.Action_From_Alias || this.Action_From;
      }
    }
    return this._truck;
  }
  // ************* TIMESTAMP ************
  set tstamp(val) {
    if (val !== this._tstamp) {
      this._tstamp = val;
      this.setAttribute('tstamp', this._tstamp);
    }
  }
  get tstamp() {
    if (this._tstamp === undefined) {
      let timereq = this.TIMEREQ;
      let h = 0;
      let m = 0;
      if (!isNaN(timereq)) {
        if(timereq/100>24) timereq = timereq/10000;
        else timereq = timereq/100;
        h = Math.floor(timereq);
        m = (timereq - Math.floor(timereq)) * 100;
      }
      const datereq = this.DATREQ || this.Date_active;
      if (datereq) {
        this._tstamp = (new Date(`${datereq} ${h}:${m}`)).getTime();
      } else {
        this._tstamp = null;
      }
    }
    return this._tstamp;
  }
  // ************* time ************
  get time() {
    if (this._time === undefined) {
      this._time = parseInt(this.TIMEREQ, 10);
      if (isNaN(this._time)) {
        this._time = null;
      } else {
        this._time = this.constructor.formatTime(this._time);
      }
    }
    return this._time;
  }
  get sortedTime() {
    if (this._sortedTime === undefined) {
      let timereq = this.TIMEREQ;
      if (!isNaN(timereq)) {
        if(timereq>2400) timereq = timereq/100;
      }
      this._sortedTime = timereq;
    }
    return this._sortedTime;
  }
  // ************* Container_size_code ************
  set Container_size_code(val) {
    if (val) {
      this.setAttribute('containersize', val <= 20 ? 'small' : ( val <= 40 ? 'large' : 'extra-large' ));
    }
  }
  // ************* oldNOTOP ************
  get oldNOTOP() {
    if (this._oldNOTOP === undefined) {
      this._oldNOTOP = false;
      // if this not-operational card is older than "yesterday"
      const yesterday = new Date((window.TODAY - (60 * 60 * 24)) * 1000);
      if (!['BAANTRANSPORT','DOKTRANSPORT','RESERVATIE'].includes(this.ACTIVITEIT) &&
        this.Date_active && 
        (new Date(this.Date_active)).getTime() < yesterday.getTime()) {
        this._oldNOTOP = true;
      }
    }
    return this._oldNOTOP;
  }
  // ************* CHUB ***************
  get actionToQparCHUB() {
    return (this.Action_To_QPAR === 'CHUB' || this.Action_To_QPAR === 'CHUB2');
  }
  get actionFromQparCHUB() {
    return (this.Action_From_QPAR === 'CHUB' || this.Action_From_QPAR === 'CHUB2');
  }
  get actionToEqualsUnLoading() {
    return (this.Action_To === this.Loading_facility_name || this.Action_To === this.Unloading_facility_name);
  }
  get actionFromEqualsUnLoading() {
    return (this.Action_From === this.Loading_facility_name || this.Action_From === this.Unloading_facility_name);
  }
}
customElements.define('tcl-card', TclCard);