import template from './row-template.js';

customElements.define('tcl-row', class TclRow extends HTMLElement {
  static get observedAttributes() {
    return ['truck', 'chauffeur', 'dok'];
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    this[attrName] = newVal;
  }
  set dok(val) {
    this.root.querySelector('.dok').textContent = val;
  }
  set truck(val) {
    if (val!==this._truck) {
      this._truck = val;
      this.setAttribute('truck', val);
      if (val !== 'null') {
        this.root.querySelector('.truck').innerHTML = val;
      }
    }
  }
  get groupby() {
    return this.getAttribute('groupby');
  }
  get truck() {
    return this._truck;
  }
  set chauffeur(val) {
    if (val!==this._chauffeur) {
      this._chauffeur = val;
      this.setAttribute('chauffeur', val);
      if (this._truck !== 'null') {
        this.root.querySelector('.chauffeur').innerHTML = val;
      }
    }
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });  // create shadow box
    this.root.innerHTML = template;
  }
});
