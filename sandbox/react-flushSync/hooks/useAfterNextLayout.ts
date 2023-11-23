import { useLayoutEffect, useRef, useState } from "react";

export function useAfterNextLayoutWithRefs() {
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

function useAfterNextLayoutWithState() {
	const [callbacks, setCallbacks] = useState([]);

	useLayoutEffect(() => {
		if (callbacks.length === 0) return;
		for (let callback of callbacks) {
			callback();
		}
		setCallbacks([]);
	}, [callbacks]);

	return (callback) => {
		setCallbacks((callbacks) => [...callbacks, callback]);
	}
}

export { useAfterNextLayoutWithRefs as useAfterNextLayout };