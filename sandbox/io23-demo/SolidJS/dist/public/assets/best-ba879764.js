import{e as m,f as S,b as f,a as g,i as b,c,F as p,t as h,g as A,h as w,d as T}from"./index-f972133b.js";import{y,a as C,c as R,F as v,S as $,g as _}from"./fuse.esm-5324ee98.js";function P(){const[n,r]=S();let s,e;const o=async a=>(e?.(),new Promise((t,i)=>{s=t,e=i,r(()=>{a()})}));return m(()=>{n()||(s?.(),s=void 0,e=void 0)}),[n,o]}function x(){const[n,r]=P(),[s,e]=f(new AbortController);return[n,async a=>{const t=new AbortController;try{await r(()=>{a(),e(t)})}catch(i){throw t.abort(),i}},()=>s().signal]}async function F(n,r,s){const e=[];if(r=="")return e;const o=performance.now();try{for(let a of n){await y(),s?.throwIfAborted();const t=a(r);e.push(...t)}return performance.measure("Computed: filterResults for: "+r,{start:o}),e.sort((a,t)=>a.score-t.score)}catch{return performance.measure("Aborted: filterResults for: "+r,{start:o}),[]}}const D=h("<div>Results (<!>):</div>",3);function I({searchTerm:n,sailData:r,abortSignal:s}){const[e]=g(()=>R(v,r)),[o]=g(()=>[n(),s()],([t,i])=>F(e(),t,i)),a=()=>o()?.slice(0,10);return[(()=>{const t=D.cloneNode(!0),i=t.firstChild,u=i.nextSibling;return u.nextSibling,b(t,()=>o()?.length,u),t})(),c(p,{get each(){return a()},children:t=>c(C,{result:t})})]}const N=h("<div></div>",2);function k(){const[n]=g(_),[r,s,e]=x(),[o,a]=f(""),[t,i]=f(""),u=async l=>{const d=l.target.value;a(d);try{await s(()=>{i(d)})}catch{}};return c(T,{get when(){return!n.loading},get children(){return[c($,{searchTerm:o,onInput:u}),(()=>{const l=N.cloneNode(!0);return b(l,c(A,{get children(){return c(I,{searchTerm:t,get sailData(){return n()},abortSignal:e})}})),m(()=>w(l,r()?"blur-sm":"")),l})()]}})}export{k as default};