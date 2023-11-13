import React, { use, cache, useDeferredValue } from "react";

function block(ms) {
	const target = ms + performance.now();
	while (performance.now() < target);
  }
  
  function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  async function fetchData(text) {
	await delay(100);
	return text;
  }
  
  export function Echo({ text }) {
	const data = use(cache(fetchData)(useDeferredValue(text)));
	return <div>{data}</div>;
  }