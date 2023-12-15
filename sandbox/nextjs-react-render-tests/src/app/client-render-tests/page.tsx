'use client';

import { useEffect, useRef } from "react";

function Nested({ value }) {
	return <div>{value}</div>;

}

export default function Page() {
	const ref = useRef(1);

	useEffect(() => {
		const interval = setInterval(() => {
			// TODO: Obviously, refs are not reactive
			// there is also no way to reference a component and to update props directly
			// without just rendering it... so you need a real state update to trigger render.
			ref.current++;
		});
		return () => clearInterval(interval);
	}, []);

	return <Nested value={ref.current} />;
};