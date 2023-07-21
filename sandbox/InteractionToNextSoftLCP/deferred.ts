// TODO: Make this class PromiseLike rather than just exposing `promise`
export class Deferred<T> {
	readonly promise: Promise<T>;
	private _resolve!: (value?: any) => void;
	private _reject!: (reason?: any) => void;

	constructor() {
		this.promise = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		})
	}

	resolve(...args) {
		this._resolve(...args);
		return this.promise;
	}

	reject(...args) {
		this._reject(...args);
		return this.promise;
	}

	static resolve(...args) {
		return new Deferred().resolve(...args);
	}
}