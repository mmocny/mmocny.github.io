import { fromEventPattern } from 'rxjs';

export function fromPerformanceObserver(options) {
	return fromEventPattern(
		handler => {
			// TODO: is there any way to have handler accept a list of args and not convert to array?
			const po = new PerformanceObserver(list => handler(list));
			po.observe(options);
			return po;
		},
		(handler, po) => {
			po.disconnect();
		}
	);
}

export default fromPerformanceObserver;