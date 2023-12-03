const allInteractions = [];

let nextInteractionId = 0;
let composition_started = false;
const activeKeyboardPotentialInteractions = new Map();

class PotentialInteraction {
	constructor(event) {
		this.interactionId = 0;
		this.events = [event];
	}

	addEvent(event) {
		this.events.push(event);
		// TODO: measure event duration on main thread?
	}

	convertToInteraction() {
		this.interactionId = ++nextInteractionId;
	}

	complete() {
		if (this.interactionId === 0) {
			// console.log('Non Interaction', this.events);
		} else {
			// console.log('Interaction', this.interactionId, this.events);
			allInteractions.push(this);
		}
	}
}

function createInteractiveEvent(event) {
	const potentialInteraction = new PotentialInteraction(event);
	return potentialInteraction;
}

function createNonInteractiveEvent(event) {
	const potentialInteraction = new PotentialInteraction(event);
	potentialInteraction.complete();
	return potentialInteraction;
}

export default function reportEventTiming(event) {
	const type = event.type;
	const keyCode = event.keyCode;
	const key = event.key;
	const code = event.code;

	switch (type) {
		case 'keydown': {
			if (composition_started) {
				const current = createNonInteractiveEvent(event);
				return;
			}

			if (activeKeyboardPotentialInteractions.has(keyCode)) {
				const previous = activeKeyboardPotentialInteractions.get(keyCode);
				if (keyCode != 229) {
					previous.convertToInteraction();
				}
				previous.complete();
				activeKeyboardPotentialInteractions.delete(keyCode);
			}

			const current = createInteractiveEvent(event);
			activeKeyboardPotentialInteractions.set(event.keyCode, current);

			break;

		} case 'keyup': {
			if (composition_started || !activeKeyboardPotentialInteractions.has(keyCode)) {
				const current = createNonInteractiveEvent(event);
				return;
			}

			const previous = activeKeyboardPotentialInteractions.get(keyCode);
			previous.addEvent(event);
			previous.convertToInteraction();
			previous.complete();
			activeKeyboardPotentialInteractions.delete(keyCode);

			break;

		} case 'compositionstart': {
			composition_started = true;
			for (let [keyCode, potentialInteraction] of activeKeyboardPotentialInteractions.entries()) {
				// potentialInteraction.convertToInteraction();
				potentialInteraction.complete();
				activeKeyboardPotentialInteractions.delete(keyCode);
			};

			break;

		} case 'compositionend': {
			composition_started = false;

			break;

		} case 'input': {
			if (!composition_started) {
				const current = createNonInteractiveEvent(event);
				return;
			}

			const current = createInteractiveEvent(event);
			current.convertToInteraction();
			current.complete();

			break;

		} default: {
			break;
		}
	}

	// TODO: "Maybe Flush" Keyboard entries
}


function findInteractionWithEventTimestamp(timestamp) {
	return allInteractions.find(interaction => interaction.events.some(event => event.timeStamp === timestamp));
}

let firstObservedInteractionID = Number.POSITIVE_INFINITY;
new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.interactionId) {
			firstObservedInteractionID = Math.min(entry.interactionId, firstObservedInteractionID);
		}

		const interaction = findInteractionWithEventTimestamp(entry.startTime);
		if (!interaction) return;

		const interactionNumber = entry.interactionId ? (entry.interactionId - firstObservedInteractionID) / 7 + 1 : 0;
		console.groupCollapsed('ET.interaction:', interactionNumber, 'Event.interaction:', interaction.interactionId, 'duration:', entry.duration);
		console.log(entry, interaction);
		console.groupEnd();
	}
}).observe({ type: 'event', buffered: true, durationThreshold: 0 });