'use client';

import measureInteractions from "../common/measureInteractions.js"
import measureLoAF from "../common/measureLoAF.js";

import { useEffect } from "react";

// This could be a hook, but its a component in case we ever inject UI.
export default function WebVitalsMonitor() {
	useEffect(() => {
		// console.log('Recording Interaction to Next Paint (INP).');

		const observers = [
			measureInteractions(),
			measureLoAF(),
		];
		return () => observers.forEach(observer => observer?.disconnect());
	}, []);

	return <></>;
}