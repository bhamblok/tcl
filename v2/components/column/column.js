import template from './column-template.js';

customElements.define('tcl-col', class TclCol extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });  // create shadow box
    this.root.innerHTML = template;
  }
});
