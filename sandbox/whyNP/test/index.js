function block(ms) {
	const target = performance.now() + ms;
	while (performance.now() < target);
  }
  
  document.addEventListener("click", async () => {
	// Sync block for less than 50ms
	block(30);
  
	// Optional: visual update
	document.body.innerText = performance.now();
  
	// microtask hop
	await 0;
  
	// block for over 50ms
	block(100);
  });
  