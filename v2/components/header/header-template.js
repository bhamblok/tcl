export default `<style>
:host {
  display: block;
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
  font: var(--font);
  width: 100%;
  background: var(--color-bg-header);
  text-align: center;
  height: 5em;
  position: fixed;
  z-index: 99;
  top: 0;
  border-bottom: 1px solid var(--color-bg);
}
:host([title="doktransporten"]) section {
  display: none;
}
h1:before {
  content: " ";
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-bg-header);
}
h1 {
  display: inline;
  /* font-family: 'Century Gothic', 'Helvetica', sans-serif; */
  /* font-family: sans-serif; */
  -webkit-font-smoothing: auto;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
  font: var(--font);
  font-weight: bold;
  font-size: 2.1em;
  text-transform: uppercase;
  text-align: center;
  padding: 0em 1em;
  position: relative;
  z-index: 0;
  margin: 0 auto;
  color: transparent;
  background:
    linear-gradient(
      to bottom, 
      var(--color-red),
      var(--color-red) 52%,
      var(--color-bg-header) 52%,
      var(--color-bg-header) 56%,
      var(--color-bg) 56%
    );
  -webkit-background-clip: text;
  background-clip: text;
}
hr {
  position: absolute;
  z-index: 0;
  top: 0.9em;
  left: 1%;
  width: 98%;
  border: none;
  border-top: 1px solid red;
}
hr.timer {
  width: 0%;
  border-color: var(--color-bg);
}
:host([autoreload]) hr.timer {
  animation: timerProgress var(--timer) linear infinite;
}
/* Animation Keyframes*/
@keyframes timerProgress {
  0% { width: 0%; }
  100% { width: 98%; }
}
section {
  text-align: right;
}
h2, h3 {
  float: right;
  margin: 0;
  padding: 0;
  font-size: 0.9em;
  width: 45.8em;
  font-weight: 200;
  text-align: center;
}
h3 {
  width: 22em;
  margin: 0.2em 0.5em 0 0.5em;
  border-top: 0.1em solid var(--color-bg);
}
h3.tweede {
  clear: both;
}
nav {
  text-align: left;
  position: absolute;
  display: flex;
  align-items: center;
  font-size: 0.8em;
  top: 3.4em;
  left: 1.6em;
}
nav .toggle {
  display: inline-block;
  cursor: pointer;
}
nav .toggle svg {
  transition: transform 0.3s ease-in-out;
}
nav ul a {
  text-decoration: none;
  color: var(--color-bg);
  border-radius: 2px;
  padding: 0.6em 1em;
  margin-left: 0.2em;
}
nav ul a:hover {
  background: rgba(0, 0, 0, 0.1);
}
nav ul, nav li {
  display: inline;
  list-style: none;
  padding: 0;
  margin: 0;
}
nav ul {
  margin-left: 1em;
  opacity: 0;
  transition: opacity 0.3s linear;
}
nav.open ul {
  opacity: 1;
}
nav.open .toggle svg {
  transform: rotate(-90deg);
}
</style>
<hr>
<hr class="timer">
<h1>...</h1>
<nav>
  <a class="toggle">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20">
      <path d="M10.001 7.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2zM10.001 5.2c1.215 0 2.199-0.986 2.199-2.2s-0.984-2.2-2.199-2.2c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2zM10.001 14.8c-1.215 0-2.201 0.985-2.201 2.2s0.986 2.2 2.201 2.2c1.215 0 2.199-0.985 2.199-2.2s-0.984-2.2-2.199-2.2z"></path>      
    </svg>
  </a>
  <ul>
    <li><a href="?day=1">M</a></li>
    <li><a href="?day=2">D</a></li>
    <li><a href="?day=3">W</a></li>
    <li><a href="?day=4">D</a></li>
    <li><a href="?day=5">V</a></li>
    <li><a href="?screen=1">S1</a></li>
    <li><a href="?screen=2">S2</a></li>
    <li><a href="?screen=3">S3</a></li>
    <li><a href="?screen=4">S4</a></li>
    <li><a href="?screen=5">S5</a></li>
    <li><a href="?dok=1">Dok1</a></li>
    <li><a href="?dok=2">Dok2</a></li>
    <li><a class="download" href="#">&lt;Get XML&gt;</a></li>
    <li><a class="fullscreen" href="#">&lt;Fullscreen&gt;</a></li>
  </ul>
</nav>
<section>
  <h2>nog in te plannen</h2>
  <h3 class="tweede">2e werk</h3>
  <h3 class="eerste">1e werk</h3>
</section>`;
