import"./logAllInteractions-7c4f95cf.js";import"./fps-meter-db9f2547.js";import{b as o}from"./blockFor-149404f6.js";const t=document.querySelector("score-keeper"),r=t.button;let e;r.addEventListener("click",()=>{t.incrementAndUpdateUI(),e&&clearTimeout(e),e=setTimeout(()=>{o(1e3)},1e3)});