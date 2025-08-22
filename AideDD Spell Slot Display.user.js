// ==UserScript==
// @name         AideDD Spell Slot Display
// @namespace    http://tampermonkey.net/
// @version      2025-08-22
// @description  Affiche sur le grimoire un affichage pour les lanceurs de sorts qui calcule les emplacements en fonction du niveau. Based on : https://fexlabs.com/5eslots/, currently does not support warlocks spells slots.
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

function loadCasterDisplay(level)
{
    let slots = spellslot_array(level);
    let display = document.getElementById("slots-display");
    display.innerHTML = "";
    let saved_level = GM_getValue("characterlevel", null);
    let changed_level = saved_level !== level;
    GM_setValue("characterlevel", level);
    for (let index = 0; index < slots.length; index++) {
        if(slots[index] !== 0)
        {
            let container = document.createElement("div");
            container.classList.add("slot-lvl-container");
            let text = document.createElement("span");
            text.style = "font-weight: bold; font-style: italic;"
            text.innerText = "Emplacements de niveau " + (index+1) + ".   ";
            container.appendChild(text);
            container.classList.add("checkbox-collection");
            let current_slots = GM_getValue("slots_level_"+(index+1), null);
            if(current_slots === null || changed_level) current_slots = slots[index];
            GM_setValue("slots_level_"+(index+1), current_slots);
            for (let scount = 0; scount < slots[index]; scount++)
            {
                let cb = document.createElement("span");
                if(scount < current_slots) cb.innerHTML = `<input type=\"checkbox\" level=\"${(index+1)}\" checked/>`;
                else cb.innerHTML = `<input type=\"checkbox\" level=\"${(index+1)}\"/>`;
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
        const level = event.target.getAttribute("level");
        let current_slots = GM_getValue("slots_level_"+level, null);
        const is_checked = event.target.checked;
        current_slots = (current_slots + (is_checked ? 1 : -1));
        GM_setValue("slots_level_"+level, current_slots);
        console.log("Current slots lvl-" + level + " : " + current_slots);
    }
    if(event.target.id === "casterlvl")
    {
        let level = event.target.value * 1;
        loadCasterDisplay(level);
    }
}

addEventListener("change", onInputInteract)

function onReady() {
    'use strict';
    let titre = document.querySelector(".titre1");
    let spellslot_elem = document.createElement("div");
    spellslot_elem.classList.add("bloc", "spellslot-container");
    let saved_level = GM_getValue("characterlevel", null);
    spellslot_elem.innerHTML = `
      <label for=\"casterlvl\"> Niveau de lanceur de sort (1-20):  <input type=\"number\" id=\"casterlvl\" name=\"casterlvl\" min=\"1\" max=\"20\" value=\"${saved_level === null ? 1 : saved_level}\"/> </label> <br> <br>
      <span class=\"center\" id=\"slots-display\"/>`;
    titre.after(spellslot_elem);

    let style = document.createElement('style');
    style.innerHTML = `
    .checkbox-collection { display: flex;}
    .slot-lvl-container {align-content:center;}
    .spellslot-container {line-height: 150%; text-align : center; align-content : center; place-content: center; display:grid!important;}
input[type="checkbox"] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  appearance: none;
  /* Not removed via appearance */
  margin: 0;

  font: inherit;
  color: color(#85fbff);
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  background-color: black;
  transform: translateY(-0.075em);

  display: grid;
  place-content: center;
}

input[type="checkbox"]::before {
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
    `;
    document.head.appendChild(style);
    if(saved_level !== null) loadCasterDisplay(saved_level);
}

if(document.readyState === "loading") { window.addEventListener('DOMContentLoaded', onReady); }
else { onReady(); }