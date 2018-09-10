/*pleaserotate.js by Rob Scanlon, MIT license. http://github.com/arscan/pleaserotate.js*/

var PleaseRotate = {};
var currentOrientation = null;
var isMobile = /Android|iPhone|iPad|iPod|IEMobile|Opera Mini/i.test(navigator.userAgent);
var init = false;

var options =
    {
    startOnPageLoad: false,
    onHide: function(){},
    onShow: function(){},
    forcePortrait: false,
    message: "POR FAVOR, ROTE SU DISPOSITIVO",
    subMessage: "",
    allowClickBypass: false,
    onlyMobile: true,
    zIndex: 1000,
    iconNode: null
    };

var cssRules =
    [
    "#pleaserotate-graphic { margin-left: 0px; width: 300px; animation: pleaserotateframes ease 2s; animation-iteration-count: infinite; transform-origin: 50% 50%; -webkit-animation: pleaserotateframes ease 2s; -webkit-animation-iteration-count: infinite; -webkit-transform-origin: 50% 50%; -moz-animation: pleaserotateframes ease 2s; -moz-animation-iteration-count: infinite; -moz-transform-origin: 50% 50%; -ms-animation: pleaserotateframes ease 2s; -ms-animation-iteration-count: infinite; -ms-transform-origin: 50% 50%; }",
    "#pleaserotate-backdrop { background-color: white; top: 0; left: 0; position: fixed; width: 100%; height: 100%; }",
    "#pleaserotate-container { width: 300px; position: absolute; top: 50%; left: 50%; margin-right: -50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%); }",
    "#pleaserotate-message { margin-top: 20px; font-size: 1.5em; text-align: center; font-family: Verdana, Geneva, sans-serif; text-transform: uppercase }",
    "#pleaserotate-message small { opacity: .5; display: block; font-size: .6em}"
    ];
    
var cssKeyframeRules =
    [
    "pleaserotateframes{ 0% { transform:  rotate(0deg) ; -moz-transform:  rotate(0deg) ;-webkit-transform:  rotate(0deg) ;-ms-transform:  rotate(0deg) ;} 49% { transform:  rotate(-90deg) ;-moz-transform:  rotate(-90deg) ;-webkit-transform:  rotate(-90deg) ; -ms-transform:  rotate(-90deg) ;  } 100% { transform:  rotate(90deg) ;-moz-transform:  rotate(-90deg) ;-webkit-transform:  rotate(-90deg) ; -ms-transform:  rotate(-90deg) ;  } }",
    ];

function overrideOptions(e){for(var t in e)options[t]=e[t]}
function setBodyClass(e){document.documentElement&&(document.documentElement.className=document.documentElement.className.replace(/(?:^|\s)pleaserotate-\S*/g,""),document.documentElement.className+=" pleaserotate-"+e)}
function addRules(e){var t;for(t=0;t<cssRules.length;t++)e.insertRule(cssRules[t],0);for(e.insertRule("#pleaserotate-backdrop { z-index: "+options.zIndex+"}",0),options.allowClickBypass&&e.insertRule("#pleaserotate-backdrop { cursor: pointer }",0),options.forcePortrait&&e.insertRule("#pleaserotate-backdrop { -webkit-transform-origin: 50% }",0),t=0;t<cssKeyframeRules.length;t++)CSSRule.WEBKIT_KEYFRAMES_RULE?e.insertRule("@-webkit-keyframes "+cssKeyframeRules[t],0):CSSRule.MOZ_KEYFRAMES_RULE?e.insertRule("@-moz-keyframes "+cssKeyframeRules[t],0):CSSRule.KEYFRAMES_RULE&&e.insertRule("@keyframes "+cssKeyframeRules[t],0)}
function createStyleSheet(){var e=document.createElement("style");e.appendChild(document.createTextNode("")),document.head.insertBefore(e,document.head.firstChild),addRules(e.sheet)}
function createElements(){var e=document.createElement("div"),t=document.createElement("div"),n=document.createElement("div"),o=document.createElement("small");e.setAttribute("id","pleaserotate-backdrop"),t.setAttribute("id","pleaserotate-container"),n.setAttribute("id","pleaserotate-message"),e.appendChild(t),null!==options.iconNode?t.appendChild(options.iconNode):t.appendChild(createPhoneSVG()),t.appendChild(n),n.appendChild(document.createTextNode(options.message)),o.appendChild(document.createTextNode(options.subMessage)),n.appendChild(o),document.body.appendChild(e)}
function createPhoneSVG(){var e=document.createElementNS("http://www.w3.org/2000/svg","svg");e.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),e.setAttribute("id","pleaserotate-graphic"),e.setAttribute("viewBox","0 0 250 250");var t=document.createElementNS("http://www.w3.org/2000/svg","g");t.setAttribute("id","pleaserotate-graphic-path"),options.forcePortrait&&t.setAttribute("transform","rotate(-90 125 125)");var n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d","M190.5,221.3c0,8.3-6.8,15-15,15H80.2c-8.3,0-15-6.8-15-15V28.7c0-8.3,6.8-15,15-15h95.3c8.3,0,15,6.8,15,15V221.3zM74.4,33.5l-0.1,139.2c0,8.3,0,17.9,0,21.5c0,3.6,0,6.9,0,7.3c0,0.5,0.2,0.8,0.4,0.8s7.2,0,15.4,0h75.6c8.3,0,15.1,0,15.2,0s0.2-6.8,0.2-15V33.5c0-2.6-1-5-2.6-6.5c-1.3-1.3-3-2.1-4.9-2.1H81.9c-2.7,0-5,1.6-6.3,4C74.9,30.2,74.4,31.8,74.4,33.5zM127.7,207c-5.4,0-9.8,5.1-9.8,11.3s4.4,11.3,9.8,11.3s9.8-5.1,9.8-11.3S133.2,207,127.7,207z"),e.appendChild(t),t.appendChild(n),e}
function setVisibility(e){var t=document.getElementById("pleaserotate-backdrop");e?t&&(t.style.display="block"):t&&(t.style.display="none")}
function orientationChanged(){var e,t=currentOrientation&&!options.forcePortrait||!currentOrientation&&options.forcePortrait;t?(e=options.onShow(),setBodyClass("showing")):(e=options.onHide(),setBodyClass("hiding")),(void 0===e||e)&&(PleaseRotate.Showing=t,setVisibility(t))}
function isPortrait(){return window.innerWidth<window.innerHeight}
function checkOrientationChange(){isMobile||!options.onlyMobile?currentOrientation!==isPortrait()&&(currentOrientation=isPortrait(),orientationChanged()):init||(init=!0,setVisibility(!1),setBodyClass("hiding"),options.onHide())}PleaseRotate.start=function(e){document.body?(e&&overrideOptions(e),createStyleSheet(),createElements(),checkOrientationChange(),window.addEventListener("resize",checkOrientationChange,!1),options.allowClickBypass&&document.getElementById("pleaserotate-backdrop").addEventListener("click",function(){var e=options.onHide();setBodyClass("hiding"),PleaseRotate.Showing=!1,(void 0===e||e)&&setVisibility(!1)})):window.addEventListener("load",PleaseRotate.start.bind(null,e),!1)},PleaseRotate.stop=function(){window.removeEventListener("resize",onWindowResize,!1)},PleaseRotate.onShow=function(e){options.onShow=e,init&&(init=!1,currentOrientation=null,checkOrientationChange())},PleaseRotate.onHide=function(e){options.onHide=e,init&&(currentOrientation=null,init=!1,checkOrientationChange())},PleaseRotate.Showing=!1,"function"==typeof define&&define.amd?(setBodyClass("initialized"),define(["PleaseRotate"],function(){return PleaseRotate})):"object"==typeof exports?(setBodyClass("initialized"),module.exports=PleaseRotate):(setBodyClass("initialized"),window.PleaseRotate=PleaseRotate,overrideOptions(window.PleaseRotateOptions),options.startOnPageLoad&&PleaseRotate.start());

PleaseRotate.start();