export default () => {
  // CLEAR EXISTING DATA
  [...document.querySelectorAll('body > tcl-day, body > tcl-row, body > tcl-col')].forEach((el) => {
    document.body.removeChild(el);
  });
  document.body.classList.remove('loading');  
}