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
  height: 3em;
  top: 2.8em;
  left: 1.6em;
}
nav.screen {
  left: 6em;
}
nav .toggle {
  display: inline-block;
  cursor: pointer;
}
nav.open ~ nav { display: none; }
nav ul a {
  text-decoration: none;
  color: var(--color-bg);
  border-radius: 2px;
  padding: 0.8em 1em;
  margin-left: 0.2em;
  display: inline-block;
}
nav ul a:hover {
  background: rgba(0, 0, 0, 0.1);
}
nav ul, nav li {
  display: inline-block;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}
nav ul {
  margin-left: 1em;
  opacity: 0;
  transition: opacity 0.3s linear;
}
nav.open ul {
  opacity: 1;
}
</style>
<hr>
<hr class="timer">
<h1>...</h1>
<nav class="desk">
  <a class="toggle">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 640 640">
      <path d="M632.128 500.192c-7.904-11.872-56.128-84.192-56.128-84.192v-288c0-35.264-28.8-64-64-64h-384c-35.232 0-64 28.736-64 64v288c0 0-48.224 72.32-56.128 84.192-7.872 11.808-7.872 18.624-7.872 27.808v16c0 16 16 32 31.968 32h576.064c15.968 0 31.968-16 31.968-32v-16c0-9.184 0-16-7.872-27.808zM224 512l19.2-32h153.6l19.2 32h-192zM512 384h-384v-256h384v256z"></path>
    </svg>
  </a>
  <ul>
    <li><a href="?day=1">Maandag</a></li>
    <li><a href="?day=2">Dinsdag</a></li>
    <li><a href="?day=3">Woensdag</a></li>
    <li><a href="?day=4">Donderdag</a></li>
    <li><a href="?day=5">Vrijdag</a></li>
    <li><a href="?dok=1">Dok1</a></li>
    <li><a href="?dok=2">Dok2</a></li>
    <li><a class="download" href="#">&lt;Get XML&gt;</a></li>
  </ul>
</nav>
<nav class="screen">
  <a class="toggle">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 640 640">
      <path d="M576 32h-512c-35.232 0-64 28.8-64 64v352c0 35.2 28.224 69.696 62.752 76.576l139.904 28c0 0-120.416 55.424-42.656 55.424h320c77.76 0-42.688-55.424-42.688-55.424l139.936-28c34.496-6.88 62.752-41.376 62.752-76.576v-352c0-35.2-28.8-64-64-64zM576 448h-512v-352h512v352z"></path>
    </svg>
  </a>
  <ul>
    <li><a href="?screen=1">Screen 1</a></li>
    <li><a href="?screen=2">Screen 2</a></li>
    <li><a href="?screen=3">Screen 3</a></li>
    <li><a href="?screen=4">Screen 4</a></li>
    <li><a href="?screen=5">Screen 5</a></li>
    <li><a href="?dok=1">Dok1</a></li>
    <li><a href="?dok=2">Dok2</a></li>
    <li>
      <a class="fullscreen" href="#">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 640 640">
          <path d="M223.584 351.584l-93.792 96.992-65.792-77.728v205.152h204.384l-77.76-66.592 96.96-93.824-64-64zM371.616 64l77.76 66.592-96.96 93.824 64 64 93.792-96.992 65.792 77.728v-205.152h-204.384z"></path>
        </svg>    
      </a>
    </li>
  </ul>
</nav>
<section>
  <h2>nog in te plannen</h2>
  <h3 class="tweede">2e werk</h3>
  <h3 class="eerste">1e werk</h3>
</section>`;
