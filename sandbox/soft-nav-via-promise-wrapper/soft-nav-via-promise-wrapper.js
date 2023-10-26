function startSoftNav() {
	document.body.innerText = '';
	const div = document.createElement('div');
	div.textContent = 'Starting Update...';
	div.style.fontSize = '10em';
	document.body.appendChild(div);
  
	const url = document.URL;
	history.replaceState(history.state, '', 'fake');
	history.replaceState(history.state, '', url);
  }
  
  // Events wrapped with Promises are awkward, but imagine the same with Observables
  function eventPromise(target, type) {
	return new Promise((resolve) =>
	  target.addEventListener(type, (event) => setTimeout(() => resolve(event), 0), { once: true })
	);
  }
  
  function eventCallback(target, type, callback) {
	target.addEventListener(type, callback, { once: true });
  }
  
  function main() {
	// Option 1:
	// eventCallback(document, 'click', startSoftNav);

	// Option 2:
	eventPromise(document, 'click').then(() => startSoftNav());
	// startSoftNav();
  }
  
  main();
  