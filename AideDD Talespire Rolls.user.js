// ==UserScript==
// @name         AideDD Talespire Rolls
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  Converts AideDD bonuses and dice rolls in text descriptions to TaleSpire links to roll in game
// @author       Neylick
// @match        https://www.aidedd.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

function convertTextToTalespireLinks(el)
{
    let desc = el.innerHTML.replace(/([^\w]|^)(\d+\s*)?d(\s*\d+\s*)((?:\s*[+-]\s*\d+)?)/g, (match, g1, g2, g3, g4) => {
        let d = (g2 == undefined ? "1" : g2) + "d" + g3 + g4;
		d = d.replace(/\s+/g, "");
        let f = d.replace(/(\d+)d100/g, "$1d10+$1d100");
		let m = g1 + `<a href="talespire://dice/:${f}"> ${d} </a>`;
		return m;
	});
	desc = desc.replace(/([^\d]|^)([+−-]\s*\d+)/g, (match, g1, g2) => {
		let f = g2.replace(/\s+/g, "");
		return g1 + `<a href=\"talespire://dice/:1d20${f}\">${g2} </a>`;
	});
	desc = desc.replace(/(D[CD]\s*\d+)/g, "<u>$1</u>");
	el.innerHTML = desc;
}

function onReady() {
    'use strict';
    const blocks1 = document.querySelectorAll('.jaune');
    const blocks2 = document.querySelectorAll('.description');
    blocks1.forEach(b => convertTextToTalespireLinks(b));
    blocks2.forEach(b => convertTextToTalespireLinks(b));
}

if(document.readyState === "loading") { window.addEventListener('DOMContentLoaded', onReady); }
else { onReady(); }