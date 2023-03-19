import { createEffect, onCleanup } from "solid-js";
import measureInteractions from "~/common/measureInteractions";
import measureLoAF from "~/common/measureLoAF";

export default function WebVitalsMonitor() {
	createEffect(() => {
		// console.log('Recording Interaction to Next Paint (INP).');

		const observers = [
			measureInteractions(),
			measureLoAF(),
		];
		onCleanup(() => observers.forEach(observer => observer?.disconnect()));
	});

	return <></>;
}