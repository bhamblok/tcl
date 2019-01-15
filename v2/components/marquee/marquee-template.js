export default `<style>
  :host {
    all: initial;
    display: block;
    /* contain: content; /* Boom. CSS containment FTW. */
    font: inherit;
    font-weight: inherit;
    overflow: hidden;
    color: inherit;
  }
  span {
    display: inline-block;
    white-space: nowrap;
  }
  span[data-content] {
    animation: marquee var(--marquee) linear infinite;
  }
  span[data-content]::after {
    content: attr(data-content);
    position: absolute;
  }
  span[data-content^="HUB"] {
    animation: none;
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-100%); }
  }
</style>
<span><slot></slot></span>`;
