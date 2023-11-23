import { useEffect } from "react";

// This is a very trivial version of this hook.
// There are several libraries that provide more robust versions.
export default function useDebouncedEffect(callback, delay, deps) {
	useEffect(() => {
		const timerid = setTimeout(callback, delay);
		return () => clearTimeout(timerid);
	}, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

