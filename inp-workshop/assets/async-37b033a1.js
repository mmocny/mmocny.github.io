import"./logAllInteractions-7c4f95cf.js";import"./fps-meter-db9f2547.js";import{b as t}from"./blockFor-149404f6.js";const e=document.querySelector("score-keeper"),o=e.button;o.addEventListener("click",()=>{setTimeout(()=>{t(1e3),e.incrementAndUpdateUI()},1e3)});