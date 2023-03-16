import { useRef } from "react";

export default function usePrevious(current: any) {
	const ref = useRef();
	const previous = ref.current;
	// Could wrap in if (current !== previous), but this shouldn't trigger effects.
	ref.current = current;

	// console.log('usePrevious:', previous, current, previous===current);
	return previous;
}