export default `<style>
  :host {
    all: initial;
    contain: content; /* Boom. CSS containment FTW. */
    display: flex;
    flex-flow: row nowrap;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
    font-smooth: never;
    font: var(--font);
    min-height: var(--card-height);
    animation: tcl-fade-in var(--fade-in) linear;
  }
  :host([gap]) {
    margin-top: var(--card-height);
  }
  :host([gap][groupby^="zzz_fictive_unloaded_date_"]) {
    margin-top: calc(0.75 * var(--card-height));
  }
  .index {
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
    font-smooth: never;
    font: var(--font);
    font-weight: bold;
    color: var(--color-white);
    width: 4.8em;
    flex-grow: 0;
    background: red;
    box-sizing: border-box;
    border: 1px solid black;
    border-left-width: 0;
    border-bottom-width: 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    padding: 0 0.5em 0 0.5em;
    overflow: hidden;
  }
  .truck { font-size: 1em; }
  .chauffeur {
    font-size: 0.8em;
    overflow: hidden;
    white-space: nowrap;
  }
  .dok {
    display: none;
    flex-grow: 1;
    flex-basis: 100%;
    width: 100%;
    height: calc(0.5 * var(--card-height));
    background: var(--color-red);
    text-align: center;
    line-height: calc(0.5 * var(--card-height));
    color: white;
    font-size: 2em;
    border-top: 1px solid var(--color-bg);
  }
  .dok:not(:empty) { display: block; }
  .row {
    flex-grow: 1;
    width: calc(100% - 5em);
    display: flex;
    flex-flow: row wrap;
  }
  :host([truck="null"]),
  :host(:not([truck])) {
    display: block;
    width: 100%;
    --card-width: 20.48em;
  }
  :host([truck="null"]) .index,
  :host(:not([truck])) .index {
    display: none;
  }
  :host([truck="null"]) .row,
  :host(:not([truck])) .row {
    width: 100%;
    min-height: var(--card-height);
  }
</style>
<div class="index">
  <tcl-marquee class="truck"></tcl-marquee>
  <div class="chauffeur"></div>
</div>
<div class="dok"></div>
<div class="row">
  <slot></slot>
</div>`;
