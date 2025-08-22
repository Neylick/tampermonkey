// ==UserScript==
// @name         AideDD Spell Slot Display
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  Affiche sur le grimoire un affichage pour les lanceurs de sorts qui calcule les emplacements en fonction du niveau. Based on : https://fexlabs.com/5eslots/.
// @author       Neylick
// @match        https://www.aidedd.org/dnd/sortsList.php
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

function spellslot_array(level)
{
    let spells = new Array(0,0,0,0,0,0,0,0,0);
    switch(level) {
        default:	spells = new Array(0,0,0,0,0,0,0,0,0);	break;
        case 1:	spells = new Array(2,0,0,0,0,0,0,0,0);	break;
        case 2:	spells = new Array(3,0,0,0,0,0,0,0,0);	break;
        case 3:	spells = new Array(4,2,0,0,0,0,0,0,0);	break;
        case 4:	spells = new Array(4,3,0,0,0,0,0,0,0);	break;
        case 5:	spells = new Array(4,3,2,0,0,0,0,0,0);	break;
        case 6:	spells = new Array(4,3,3,0,0,0,0,0,0);	break;
        case 7:	spells = new Array(4,3,3,1,0,0,0,0,0);	break;
        case 8:	spells = new Array(4,3,3,2,0,0,0,0,0);	break;
        case 9:	spells = new Array(4,3,3,3,1,0,0,0,0);	break;
        case 10: spells = new Array(4,3,3,3,2,0,0,0,0);	break;
        case 11: spells = new Array(4,3,3,3,2,1,0,0,0);	break;
        case 12: spells = new Array(4,3,3,3,2,1,0,0,0);	break;
        case 13: spells = new Array(4,3,3,3,2,1,1,0,0);	break;
        case 14: spells = new Array(4,3,3,3,2,1,1,0,0);	break;
        case 15: spells = new Array(4,3,3,3,2,1,1,1,0);	break;
        case 16: spells = new Array(4,3,3,3,2,1,1,1,0);	break;
        case 17: spells = new Array(4,3,3,3,2,1,1,1,1);	break;
        case 18: spells = new Array(4,3,3,3,3,1,1,1,1);	break;
        case 19: spells = new Array(4,3,3,3,3,2,1,1,1);	break;
        case 20: spells = new Array(4,3,3,3,3,2,2,1,1);	break;
    }
    return spells;
}

function warlockslot_array(level)
{
	let spells = undefined;
	switch (level) {
		default: spells = new Array(0,0,0,0,0); break;
		case 1: spells = new Array(1,0,0,0,0); break;
		case 2: spells = new Array(2,0,0,0,0); break;
		case 3: spells = new Array(0,2,0,0,0); break;
		case 4: spells = new Array(0,2,0,0,0); break;
		case 5: spells = new Array(0,0,2,0,0); break;
		case 6: spells = new Array(0,0,2,0,0); break;
		case 7: spells = new Array(0,0,0,2,0); break;
		case 8: spells = new Array(0,0,0,2,0); break;
		case 9: spells = new Array(0,0,0,0,2); break;
		case 10: spells = new Array(0,0,0,0,2); break;
		case 11: spells = new Array(0,0,0,0,3); break;
		case 12: spells = new Array(0,0,0,0,3); break;
		case 13: spells = new Array(0,0,0,0,3); break;
		case 14: spells = new Array(0,0,0,0,3); break;
		case 15: spells = new Array(0,0,0,0,3); break;
		case 16: spells = new Array(0,0,0,0,3); break;
		case 17: spells = new Array(0,0,0,0,4); break;
		case 18: spells = new Array(0,0,0,0,4); break;
		case 19: spells = new Array(0,0,0,0,4); break;
		case 20: spells = new Array(0,0,0,0,4); break;
	}
	return spells;
}

function loadCasterDisplay(level, wlevel)
{
	let saved_level = GM_getValue("casterlevel", null);
	let changed_level = (saved_level !== level) && (level !== null);

	let saved_wlevel = GM_getValue("warlocklevel", null);
	let changed_wlevel = (saved_wlevel !== wlevel) && (wlevel !== null);

	if(level === null) level = (saved_level === null ? 0 : saved_level);
	if(wlevel === null) wlevel = (saved_wlevel === null ? 0 : saved_wlevel);
	let slots = spellslot_array(level);
	let wslots = warlockslot_array(wlevel)

	GM_setValue("casterlevel", level);
	GM_setValue("warlocklevel", wlevel);

	let display = document.getElementById("slots-display");
	display.innerHTML = "";

	for (let index = 0; index < slots.length; index++) {
		let has_regular_slot = (slots[index] !== 0);
		let has_warlock_slot = (index < wslots.length && wslots[index] !== 0);
		if(has_regular_slot || has_warlock_slot)
		{
			let container = document.createElement("div");
			container.classList.add("slot-lvl-container");
			let text = document.createElement("span");
			text.style = "font-weight: bold; font-style: italic;"
			text.innerText = `Emplacement niveau ${(index+1)}.`;
			container.appendChild(text);
			container.classList.add("checkbox-collection");

			let current_slots = GM_getValue("slots_level_"+(index+1), null);
			if(current_slots === null || changed_level) current_slots = slots[index];
			GM_setValue("slots_level_"+(index+1), current_slots);

			let current_wslots = GM_getValue("wslots_level_"+(index+1), null);
			if(current_wslots === null || changed_wlevel) current_wslots = wslots[index];
			GM_setValue("wslots_level_"+(index+1), current_wslots);

			for (let scount = 0; scount < slots[index]; scount++)
			{
				let cb = document.createElement("span");
                cb.style = "place-content: center;";
				if(scount < current_slots) cb.innerHTML = `<input class="slot" type=\"checkbox\" level=\"${(index+1)}\" checked/>`;
				else cb.innerHTML = `<input class="slot" type=\"checkbox\" level=\"${(index+1)}\"/>`;
				container.appendChild(cb);
			}

			for (let scount = 0; scount < wslots[index]; scount++)
			{
				let cb = document.createElement("span");
                cb.style = "place-content: center;";
				if(scount < current_wslots) cb.innerHTML = `<input class="wslot" type=\"checkbox\" level=\"${(index+1)}\" checked/>`;
				else cb.innerHTML = `<input class="wslot" type=\"checkbox\" level=\"${(index+1)}\"/>`;
				container.appendChild(cb);
			}

			display.appendChild(container);
		}
	}
}


function onInputInteract(event)
{
    if(event.target.getAttribute("type") === "checkbox")
    {
			if(event.target.classList.contains("wslot")) {
				const level = event.target.getAttribute("level");
        let current_slots = GM_getValue("wslots_level_"+level, null);
        const is_checked = event.target.checked;
        current_slots = (current_slots + (is_checked ? 1 : -1));
        GM_setValue("wslots_level_"+level, current_slots);
        console.log("Current warlock slots lvl-" + level + " : " + current_slots);
			}
			else
			{
				const level = event.target.getAttribute("level");
        let current_slots = GM_getValue("slots_level_"+level, null);
        const is_checked = event.target.checked;
        current_slots = (current_slots + (is_checked ? 1 : -1));
        GM_setValue("slots_level_"+level, current_slots);
        console.log("Current slots lvl-" + level + " : " + current_slots);
			}
    }
    if(event.target.id === "casterlvl")
    {
        let level = event.target.value * 1;
        loadCasterDisplay(level, null);
    }
		if(event.target.id === "warlocklvl")
    {
        let level = event.target.value * 1;
        loadCasterDisplay(null, level);
    }
}

addEventListener("change", onInputInteract)

function onReady() {
    'use strict';
    let titre = document.querySelector(".titre1");
    let spellslot_elem = document.createElement("div");
    spellslot_elem.classList.add("bloc", "spellslot-container");
    let saved_level = GM_getValue("casterlevel", null);
		let saved_wlevel = GM_getValue("warlocklevel", null);
    spellslot_elem.innerHTML = `
      <label for=\"casterlvl\"> Niveau de lanceur de sort combiné (0-20):  <input type=\"number\" id=\"casterlvl\" name=\"casterlvl\" min=\"0\" max=\"20\" value=\"${saved_level === null ? 1 : saved_level}\" /> </label> <br> <br>
      <label for=\"warlocklvl\"> Niveau de Warlock/Démoniste/Occuliste (0-20):  <input type=\"number\" id=\"warlocklvl\" name=\"warlocklvl\" min=\"0\" max=\"20\" value=\"${saved_wlevel === null ? 1 : saved_wlevel}\" /> </label> <br> <br>
			<span class=\"center\" id=\"slots-display\"/>
			`;
    titre.after(spellslot_elem);

    let style = document.createElement('style');
    style.innerHTML = `
    .checkbox-collection { display: flex; }
    .slot-lvl-container { align-content:center; }
    .spellslot-container {line-height: 150%; text-align : center; align-content : center; place-content: center; display:grid!important; font-size: 16px;}
input[type="checkbox"] {
  /* Remove most all native input styles */
  appearance: none;
  /* Not removed via appearance */
  margin: 0;

  font: inherit;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  background-color: black;
  transform: translateY(-0.075em);
  vertical-align:middle;

  display: grid;
  place-content: center;
}



.slot[type="checkbox"]::before {
	content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transform-origin: center;
  transition: 120ms transform ease-in-out;
  color: color(#85fbff);
  background: radial-gradient(
  circle at center,
  rgba(133, 251, 255, 1),
  rgba(133, 251, 255, 1) 30%,
  rgba(39, 118, 140, 1) 90%,
  rgba(0, 0, 0, 1) 100%
);
}

input[type="checkbox"]:checked::before {
  transform: scale(1);
}

input[type="checkbox"]:focus {
  outline: max(1px, 0.1em) solid black;
  outline-offset: min(1px, 0.1em);
}

.wslot[type="checkbox"]::before {
	content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transform-origin: center;
  transition: 120ms transform ease-in-out;
  color: color(#ff65ff);
	background: radial-gradient(
  circle at center,
  #ff65ff,
  #ff65ff 30%,
  #820c7c 90%,
  rgba(0, 0, 0, 1) 100%
) !important;
}
    `;
    document.head.appendChild(style);
    loadCasterDisplay(saved_level, saved_wlevel);
}

if(document.readyState === "loading") { window.addEventListener('DOMContentLoaded', onReady); }
else { onReady(); }