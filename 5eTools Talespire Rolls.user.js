// ==UserScript==
// @name         5eTools Talespire Rolls
// @namespace    http://tampermonkey.net/
// @version      2025-08-21
// @description  Parse the 5e.tools website for dice rolls and changes the HTML element to be a link for talespire dice throws
// @author       Neylick
// @match        https://5e.tools/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// ==/UserScript==

const roll_onclick = (event) => {
    event.preventDefault();
    let dice = event.target.getAttribute("dice");
    window.open("talespire://dice/:" + dice);
}

(function replace_rolls() {
    'use strict';
    document.querySelectorAll(".roller").forEach(roll => {
        let dice_data = JSON.parse(roll.getAttribute("data-packed-dice"));
		let d = dice_data.toRoll.replace(/\s/g, "");
        d = d.replace("/(\d+)d100/g", "$1d10+$1d100");
        roll.outerHTML = roll.outerHTML.replace(/<.*>(.*)<\/.*>/g, (match, g1) =>
        {
            return "<a title=\"Talespire dice : "+d+"\" href=talespire://dice/:" + d + ">" + g1 + "</a>";
            //return "<span dice=\""+d+"\" onmousedown=roll_onclick style=\"background-color: rgb(154, 177, 255); border-radius: 3px; color: black !important;\">"+g1+"</span>";
        })
    });
    setTimeout(replace_rolls, 500);
})();