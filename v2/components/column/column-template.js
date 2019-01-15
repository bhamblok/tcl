export default `<style>
  :host {
    all: initial;
    contain: content; /* Boom. CSS containment FTW. */
    float: right;
    -webkit-font-smoothing: none;
    -moz-osx-font-smoothing: unset;
    font-smooth: never;
    font: var(--font);
    display: flex;
    flex-flow: column wrap;
    width: calc(var(--card-width) - 1px);
    padding: 0 0 0 1px;
    /* background-color: #333; */
    padding-bottom: var(--card-height);
  }
</style>
<slot></slot>`;
