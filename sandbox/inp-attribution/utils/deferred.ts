export class Deferred {
	readonly promise: Promise<void>;
	private _resolve!: (value?: any) => void;
	private _reject!: (reason?: any) => void;
  
	constructor() {
	  this.promise = new Promise((resolve, reject) => {
		this._resolve = resolve;
		this._reject = reject;
	  })
	}
  
	resolve(...args) {
	  return this._resolve(...args);
	}
  
	reject(...args) {
	  return this._reject(...args);
	}
  }