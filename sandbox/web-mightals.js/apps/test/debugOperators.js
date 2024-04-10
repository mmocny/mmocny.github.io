function debugOperators(operatorFunction, name) {
	return function (source) {
		console.log(`Applying operator: ${name}`);
		return operatorFunction(source);
	};
}
