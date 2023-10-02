export default `<style>
:host {
  all: initial;
  /* contain: content; */
  contain: strict;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
  font: var(--font);
  display: inline-block;
  flex-grow: 0;
  box-sizing: border-box;
  border: 1px solid var(--color-bg);
  border-left-width: 0;
  border-bottom-width: 0;
  background: var(--color-red, red);
  width: var(--card-width);
  height: var(--card-height);
  padding: 0;
  margin: 0;
  opacity: 0;
  animation: tcl-fade-in var(--fade-in) linear forwards;
  position: relative;
}
:host([gap]) {
  margin-top: var(--card-height);
}
:host(.alert):before,
:host(.prior):after,
:host(.adr) .content:before,
:host(.refrigerated) .content:before,
:host(.customs) .content:before {
  content: " ";
  position: absolute;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14" height="14"><path d="M501.5 383.8l-181-332.4c-13.8-22.8-37.8-36.6-64.5-36.6s-50.7 13.8-64.5 36.6l-181 332.4c-13.8 23.7-14 52-.6 75.6 13 23.6 37.3 37.8 65 37.8h362c27 0 51.3-14 65-37.8 13.3-23.7 13-52-.8-75.6z" fill="%23ffffff"/><path d="M502 459.4c-13.4 23.7-37.7 37.8-65 37.8H256V14.8c26.7 0 50.7 13.8 64.5 36.6l181 332.4c13.8 23.7 14 52 .6 75.6z" fill="%23ffffff"/><path d="M475.7 399l-181-332.3c-8-13.8-22.8-22-38.7-22s-30.6 8.2-38.7 22L36.3 399c-8.4 14.2-8.4 31.3-.3 45.4 8 14.4 22.8 22.8 39 22.8h362c16.2 0 31-8.4 39-22.8 8-14 8-31.2-.3-45.3z" fill="%23ff0000"/><path d="M476 444.4c-8 14.4-22.8 22.8-39 22.8H256V44.8c16 0 30.6 8 38.7 22l181 332.3c8.4 14.6 8.4 31.7.3 45.8z" fill="%23ff0000"/><path d="M256 437.2c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30zm30-120c0 16.5-13.5 30-30 30s-30-13.5-30-30v-150c0-16.5 13.5-30 30-30s30 13.5 30 30v150z" fill="%23ffffff"/><path d="M286 407.2c0-16.5-13.5-30-30-30v60c16.5 0 30-13.5 30-30zm0-90v-150c0-16.5-13.5-30-30-30v210c16.5 0 30-13.5 30-30z" fill="%23ffffff"/></svg>') no-repeat;
  border: 1px solid transparent;
  width: 14px;
  height: 14px;
  left: -4px;
  z-index: 9;
}
:host(.alert):before { top: -2px; }
:host(.prior):after,
:host(.adr) .content:before,
:host(.refrigerated) .content:before,
:host(.customs) .content:before {
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 19.7c-1 0-1.6-.8-1.6-1.7 0-1 .7-1.7 1.6-1.7 1 0 1.6.7 1.6 1.7s-.6 1.7-1.6 1.7zm.6-6.4c-.2.8-1 .8-1.2 0-.3-1-1.3-4.6-1.3-7 0-3 4-3 4 0 0 2.5-1 6.2-1.4 7z" fill="%23FFDA44"/></svg>') no-repeat;
  border-color: white;
  border-radius: 50%;
  background-color: white;
  bottom: 0;
}
:host(.adr) .content:before {
  left: auto;
  right: 0;
  bottom: 20%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.9 473.9" width="14" height="14"><circle cx="237" cy="237" r="237" fill="%23FFDA44"/><path d="M238.2 50.5V237L411 166.6l-4.2-9.5c-30-63-94.2-106-168.6-106zM79.2 335L238 237 87.7 127c-43.5 59-49.3 141.2-8.4 208zm330-23.8l-171-74.2-4.3 186.4c73 1.6 144-40.4 175-112.2z" fill="%23000000"/><circle cx="237" cy="237" r="37.4" fill="%23FFDA44"/></svg>') no-repeat;
}
:host(.refrigerated) .content:before,
:host(.customs) .content:before {
  left: auto;
  right: 0;
  bottom: 20%;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 504.124 504.124" width="14" height="14" style="enable-background:new 0 0 504.124 504.124;" xml:space="preserve"><circle cx="252" cy="252" r="252" fill="%23FFDA44"/><path style="fill:%23D7B354;" d="M330.831,129.969H173.293c-2.363,0-3.938,1.575-3.938,3.938v7.877c0,2.363,1.575,3.938,3.938,3.938 h157.538c2.363,0,3.938-1.575,3.938-3.938v-7.877C334.77,131.938,333.194,129.969,330.831,129.969z M330.831,185.108H173.293 c-2.363,0-3.938,1.575-3.938,3.938v7.877c0,2.363,1.575,3.938,3.938,3.938h157.538c2.363,0,3.938-1.575,3.938-3.938v-7.877 C334.77,187.077,333.194,185.108,330.831,185.108z M330.831,244.185H173.293c-2.363,0-3.938,1.575-3.938,3.938V256 c0,2.363,1.575,3.938,3.938,3.938h157.538c2.363,0,3.938-1.575,3.938-3.938v-7.877C334.77,246.154,333.194,244.185,330.831,244.185z"/><path style="fill:%23F5DD9E;" d="M126.031,425.354c-8.665,0-15.754,7.089-15.754,15.754s7.089,15.754,15.754,15.754 s15.754-7.089,15.754-15.754S134.695,425.354,126.031,425.354z M378.092,425.354c-8.665,0-15.754,7.089-15.754,15.754 s7.089,15.754,15.754,15.754s15.754-7.089,15.754-15.754S386.757,425.354,378.092,425.354z M126.031,47.262 c-8.665,0-15.754,7.089-15.754,15.754s7.089,15.754,15.754,15.754s15.754-7.089,15.754-15.754S134.695,47.262,126.031,47.262z M378.092,70.892c8.665,0,15.754-7.089,15.754-15.754s-7.089-15.754-15.754-15.754s-15.754,7.089-15.754,15.754 S369.428,70.892,378.092,70.892z"/><path style="fill:%23F2F1EF;" d="M204.801,285.145V99.643c0-26.782,20.48-48.443,47.262-48.443s47.262,21.662,47.262,48.443v185.502 c0,10.24,5.12,20.086,12.603,27.569c14.178,14.572,22.843,34.658,22.843,56.714c0.394,44.111-35.446,81.92-79.557,83.495 c-47.262,1.969-85.858-35.84-85.858-82.708c0-22.449,8.665-42.535,23.237-57.502C199.286,305.231,204.801,295.385,204.801,285.145z"	/><path style="fill:%23E2574C;" d="M319.016,370.215c0,37.022-29.932,66.954-66.954,66.954s-66.954-29.932-66.954-66.954 c0-25.6,14.178-47.655,35.446-59.077V137.846h63.015v173.292C304.837,322.56,319.016,344.615,319.016,370.215z"/><path style="fill:%23E5685E;" d="M283.569,311.138V137.846h-31.508v299.323c37.022,0,66.954-29.932,66.954-66.954 C319.016,344.615,304.837,322.56,283.569,311.138z"/><path style="fill:%23CB4E44;" d="M252.063,126.031c17.329,0,31.508,5.12,31.508,11.815c0,6.695-14.178,11.815-31.508,11.815 s-31.508-5.12-31.508-11.815C220.555,131.545,234.732,126.031,252.063,126.031z"/></svg>') no-repeat;
}
:host(.customs) .content:before {
  border-color: transparent;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M20.377 11.082c-.06 1.929-2.229 3.126-8.409 3.126-6.193 0-8.358-1.203-8.409-3.139 1.508 0 4.379-1.958 8.409-1.958 3.927-.001 7.144 1.971 8.409 1.971zm-8.408 4.09c-2.062 0-3.74-.131-5.078-.397.062.555.469 3.322 2.409 3.322 1.721 0 1.673-1.316 2.721-1.316 1.047 0 1.169 1.316 2.852 1.316 2.09 0 2.46-3.063 2.494-3.389-1.387.311-3.169.464-5.398.464zm6.405-.741c-.04 2.171-.717 4.769-2.28 6.437-1.048 1.119-2.377 1.687-3.949 1.687-1.575 0-2.898-.533-3.931-1.582-1.646-1.673-2.302-4.345-2.396-6.461-.523-.158-1.01-.347-1.484-.628-.016 2.472.704 5.942 2.821 8.094 1.321 1.341 3 2.022 4.99 2.022 1.972 0 3.712-.745 5.033-2.153 2.131-2.273 2.76-5.679 2.661-8.111-.459.308-.944.521-1.465.695zm-6.237-10.984l-.313.623-.701.1.507.485-.119.685.626-.324.627.324-.12-.685.507-.485-.7-.1-.314-.623zm7.211-.206s-2.537-.686-7.348-3.241c-4.812 2.555-7.348 3.241-7.348 3.241s-1.295 2.4-3.652 5.016l2.266 1.908c1.533-.165 4.64-2.082 8.734-2.082s7.201 1.917 8.734 2.083l2.266-1.909c-2.357-2.616-3.652-5.016-3.652-5.016zm-6.345 3.214c-.526.131-.605.188-.875.402-.269-.214-.349-.271-.875-.402-.731-.183-1.151-.656-1.151-1.299 0-.359.147-.691.318-1.146.192-.513.083-.675-.119-.882l-.171-.176.987-.819c.098.098.235.278.486.278.248 0 .416-.175.528-.271.102.09.268.271.523.271.248 0 .381-.171.49-.281l.983.823-.172.176c-.202.207-.311.369-.119.882.17.455.318.786.318 1.146 0 .641-.42 1.115-1.151 1.298z"/></svg>') no-repeat;
}
:host(.adr.refrigerated) .content:before,
:host(.adr.customs) .content:before { right: 14px; }
:host(.adr.refrigerated.customs) .content:before { right: 28px; }
.pickup-name:empty,
.loading:empty,
.turnin-name:empty,
.original-cargo-number:empty,
.container-type:empty,
.avail-after-customs-ref:empty,
.in-out-coming:empty,
.in-out-coming2:empty,
.activiteit,
.info,
.size,
.direction { display: none; }
:host([containersize="small"]) { background: #ffffbb; }
:host([containersize="large"]) { background: #bbddff; }
:host([containersize="extra-large"]) { background: #ccff66; }
:host([special-equipment="special-equipment"]) { background: #ccff66; }
:host([activiteit="RESERVATIE"]) { background: #99cc00; }
:host(.shaded) {
  --shade: rgba(0, 0, 0, 0.15);
  background-image: repeating-linear-gradient(-45deg, transparent, transparent 1.75em, var(--shade) 1.75em, var(--shade) 3.5em);
}
:host([activiteit="GARAGE"]) { background: var(--color-orange, #ffbb00); }
:host([activiteit="GARAGE"]) .activiteit,
:host([activiteit="PARKING"]) .activiteit,
:host([activiteit="DOK"]) .activiteit,
:host([activiteit="VERLOF"]) .activiteit,
:host([activiteit="ZIEKTE"]) .activiteit,
:host([activiteit="RESERVATIE"]) .activiteit,
:host([activiteit="ECONOMISCH WERKLOOS"]) .activiteit {
  display: block;
  font-size: 1.2em;
  font-weight: bold;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  font-smooth: auto;
  line-height: 1.1em;
  padding-top: 0.4em;
}
:host([activiteit="GARAGE"]) .info,
:host([activiteit="PARKING"]) .info,
:host([activiteit="DOK"]) .info,
:host([activiteit="VERLOF"]) .info,
:host([activiteit="ZIEKTE"]) .info,
:host([activiteit="ECONOMISCH WERKLOOS"]) .info {
  display: block;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  line-height: 1.1em;
}
:host([activiteit="RESERVATIE"]) .activiteit {
  font-weight: normal;
  float: left;
  height: 100%;
  padding-top: 0.4em;
  padding-right: 1em;
}
:host([activiteit="RESERVATIE"]) .direction,
:host([activiteit="RESERVATIE"]) .size,
:host([activiteit="RESERVATIE"]) .loading {
  display: block;
  float: left;
}
:host([activiteit="RESERVATIE"]) .loading {
  padding-top: 0.5em;
  width: 40%;
  font-weight: normal;
}
:host([activiteit="RESERVATIE"]) .size {
  display: block;
  float: right;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
  border: none;
  width: 100%;
  height: 100%;
}
.content {
  contain: strict;
  vertical-align: top;
  font-size: 0.9em;
  /* use absolute padding for windows screen resolution */
  /* padding: 0.25em 0.5em 0 1.25em; */
  padding: 2px 2px 0 3px;
  position: relative;
  font-size: 1em;
  line-height: 1.1;
}
.trailer {
  text-align: center;
  vertical-align: center;
  background: var(--color-red, red);
  border-left: 1px solid var(--color-bg);
  color: white;
  font-size: 0.9em;
  width: 0px;
  display: none;
}
.trailer:not(:empty) { width: 3.5em; display: table-cell; }
.trailer tcl-marquee { width: 3.5em; text-align: center; }
.pickup-name,
.loading,
.turnin-name,
.original-cargo-number,
.container-type,
.avail-after-customs-ref,
.in-out-coming,
.in-out-coming2 { float: left; margin-right: 0.5em; }
.pickup-name { width: 28%; max-width: 16em; }
.loading { font-weight: bold; width: 34%; max-width: 16em; }
.turnin-name { width: 28%; float: right; text-align: right; margin-right: 0; max-width: 16em; }
.in-out-coming2 { float: right; text-align: right; margin-right: 0; }
.original-cargo-number { min-width: 8em; clear: left; }
.avail-after-customs-ref { min-width: 6em; clear: left; }
</style>
<table>
<tr>
  <td class="content">
    <div class="activiteit"></div>
    <tcl-marquee class="pickup-name"></tcl-marquee>
    <tcl-marquee class="loading"></tcl-marquee>
    <tcl-marquee class="turnin-name"></tcl-marquee>
    <tcl-marquee class="original-cargo-number"></tcl-marquee>
    <tcl-marquee class="container-type"></tcl-marquee>
    <tcl-marquee class="avail-after-customs-ref"></tcl-marquee>
    <tcl-marquee class="in-out-coming"></tcl-marquee>
    <tcl-marquee class="in-out-coming2"></tcl-marquee>
    <div class="direction"></div>
    <div class="size"></div>
    <tcl-marquee class="info"></tcl-marquee>
  </td>
  <td class="trailer"></td>
</tr>
</table>`;
