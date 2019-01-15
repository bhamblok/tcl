export default (elements, prop1, prop2) => {
  function sortOnProp(a, b, prop) {
    if(!isNaN(a[prop]) && !isNaN(b[prop])) {
      return parseInt(a[prop], 10) - parseInt(b[prop], 10);
    } else if(!isNaN(a[prop]) && isNaN(b[prop])) {
      return -1;
    } else if(isNaN(a[prop]) && !isNaN(b[prop])) {
      return 1;
    } else {
      if(a[prop].toLowerCase() > b[prop].toLowerCase()) {
        return 1;
      } else if(a[prop].toLowerCase() < b[prop].toLowerCase()) {
        return -1;
      }
    }
    return 0;
  }
  elements.sort((a, b) => {
    // if (a[prop] < b[prop]) return -1;
    // if (a[prop] > b[prop]) return 1;
    // SORT ON PROP 1
    let res = sortOnProp(a, b, prop1);
    // SORT ON PROP 2
    if (res === 0 && prop2) res = sortOnProp(a, b, prop2);
    return res;      
  });
  elements.forEach(i => i.parentNode.appendChild(i));
}
