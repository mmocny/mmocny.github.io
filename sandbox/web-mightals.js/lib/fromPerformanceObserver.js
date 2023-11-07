import { fromEventPattern } from 'rxjs';

// In RxJS it seems common to use fromFoo naming pattern
export function fromPerformanceObserver(options) {
	return fromEventPattern(
		handler => {
			// TODO: handler args... are wrapped up as an Array<>
			const po = new PerformanceObserver(list => handler(list));
			po.observe(options);
			return po;
		},
		(handler, po) => {
			console.log('disconnecting', po);
			po.disconnect();
		}
	);
}

export default fromPerformanceObserver;