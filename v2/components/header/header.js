import template from './header-template.js';

customElements.define('tcl-header', class extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'autoreload'];
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    if(oldVal !== newVal) {
      this[attrName] = newVal;
    }
  }
  set title(val) {
    this.root.querySelector('h1').innerHTML = val;
  }
  get title() {
    return this.root.querySelector('h1').innerHTML;
  }
  set autoreload(val) {
    this.root.querySelector('.timer').style.setProperty('--timer', val);
  }
  get autoreload() {
    return this.getAttribute('autoreload');
  }
  download(e) {
    e.preventDefault();
    const blob = new Blob([XMLString], {type: 'application/xml'});
    const event = document.createEvent('MouseEvents');
    const a = document.createElement('a');
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    a.download = `TCL - Snap Shot ${year}-${month<10?'0'+month:month}-${day<10?'0'+day:day} at ${h<10?'0'+h:h}.${m<10?'0'+m:m}.${s<10?'0'+s:s}.xml`;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl =  ['application/xml', a.download, a.href].join(':');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(event);
  }
  fullscreen(e) {
    e.preventDefault();
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); 
      }
    }
  }
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });  // create shadow box
    this.root.innerHTML = template;
    // FIRE EVENT WHEN TIMER PROGRESS IS ITERATED
    this.root.querySelector('.timer').addEventListener('animationiteration', (e) => {
      document.dispatchEvent(new Event('reload'));
    });
    this.root.querySelector('nav .toggle').addEventListener('click', (e) => {
      this.root.querySelector('nav').classList.toggle('open');
    });
    this.root.querySelector('.download').addEventListener('click', this.download);
    this.root.querySelector('.fullscreen').addEventListener('click', this.fullscreen);
  }
});
