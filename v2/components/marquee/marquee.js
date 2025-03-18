import template from './marquee-template.js';

customElements.define('tcl-marquee', class TclMarquee extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });  // create shadow box
    root.innerHTML = template;
    const span = root.querySelector('span');
    const checkspan = (content) => {
      if (span.clientWidth > this.clientWidth) {
        span.setAttribute('data-content', content);
        span.innerHTML += '&nbsp;&nbsp;-&nbsp;&nbsp;';
      } else {
        span.removeAttribute('data-content');
      }
    }
    // create an observer instance
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes[0]) {
          checkspan(mutation.addedNodes[0].data);
        }
      });
    });
    if (this.innerHTML) {
      checkspan(this.innerHTML);
    }
    // pass in the target node, as well as the observer options
    observer.observe(this, { attributes: true, childList: true, characterData: true });
  }
});
