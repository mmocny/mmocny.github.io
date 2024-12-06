const allInteractions = [];

let nextInteractionId = 0;
let composition_started = false;
const activeKeyboardPotentialInteractions = new Map();

class PotentialInteraction {
	constructor(eventTimingEntry) {
		this.interactionId = 0;
		this.eventTimingEntries = [eventTimingEntry];
	}

	addEventTimingEntry(eventTimingEntry) {
		eventTimingEntry.interactionId = this.interactionId;
		this.eventTimingEntries.push(eventTimingEntry);
	}

	convertToInteraction() {
		this.interactionId = ++nextInteractionId;
		this.eventTimingEntries.forEach(event => event.interactionId = this.interactionId);
		allInteractions.push(this);
	}

	markComplete() {
		console.log('Interaction:', this.eventTimingEntries);
	}
}

export default function assignInteractionId(eventTimingEntry) {
	const event = eventTimingEntry.event;
	const keyCode = event.keyCode;
	// const key = event.key;
	// const code = event.code;

	switch (event.type) {
		case 'keydown': {
			// Ignore key events during composition
			if (composition_started) {
				return;
			}

			// If we already have an interaction for this keyCode, we need to flush it out.
			if (activeKeyboardPotentialInteractions.has(keyCode)) {
				const previous = activeKeyboardPotentialInteractions.get(keyCode);
				if (keyCode != 229) {
					previous.convertToInteraction();
				}
				previous.markComplete();
				activeKeyboardPotentialInteractions.delete(keyCode);
			}

			const interaction = new PotentialInteraction(eventTimingEntry);
			activeKeyboardPotentialInteractions.set(event.keyCode, interaction);
			return interaction;

		} case 'keyup': {
			// Ignore key events during composition
			if (composition_started || !activeKeyboardPotentialInteractions.has(keyCode)) {
				return;
			}

			const interaction = activeKeyboardPotentialInteractions.get(keyCode);
			interaction.addEventTimingEntry(eventTimingEntry);
			interaction.convertToInteraction();
			interaction.markComplete();
			activeKeyboardPotentialInteractions.delete(keyCode);
			return interaction;

		} case 'compositionstart': {
			composition_started = true;
			for (let [keyCode, potentialInteraction] of activeKeyboardPotentialInteractions.entries()) {
				potentialInteraction.markComplete();
				activeKeyboardPotentialInteractions.delete(keyCode);
			};
			return;

		} case 'compositionend': {
			composition_started = false;
			return;

		} case 'input': {
			if (!composition_started) {
				return;
			}

			const current = new PotentialInteraction(eventTimingEntry);
			current.convertToInteraction();
			current.markComplete();

			break;

		} default: {
			break;
		}
	}

	// TODO: "Maybe Flush" Keyboard entries
}


// function findInteractionWithEventTimestamp(timestamp) {
// 	return allInteractions.find(interaction => interaction.events.some(event => event.timeStamp === timestamp));
// }

// let firstObservedInteractionID = Number.POSITIVE_INFINITY;
// new PerformanceObserver((list) => {
// 	for (const entry of list.getEntries()) {
// 		if (entry.interactionId) {
// 			firstObservedInteractionID = Math.min(entry.interactionId, firstObservedInteractionID);
// 		}

// 		const interaction = findInteractionWithEventTimestamp(entry.startTime);
// 		if (!interaction) return;

// 		const interactionNumber = entry.interactionId ? (entry.interactionId - firstObservedInteractionID) / 7 + 1 : 0;
// 		console.groupCollapsed('ET.interaction:', interactionNumber, 'Event.interaction:', interaction.interactionId, 'duration:', entry.duration);
// 		console.log(entry, interaction);
// 		console.groupEnd();
// 	}
// }).observe({ type: 'event', buffered: true, durationThreshold: 0 });