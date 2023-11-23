import { useLayoutEffect, useRef } from "react";

export function useAfterNextLayout() {
	const callbacks = useRef([]);

	useLayoutEffect(() => {
		for (let callback of callbacks.current) {
			callback();
		}
		callbacks.current = [];
	}); // No args on purpose

	return (callback) => {
		callbacks.current.push(callback);
	}
}

export default useAfterNextLayout;