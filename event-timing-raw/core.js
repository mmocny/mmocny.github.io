// Event Timing Viewer Core logic

// Flattened table column configuration
var _table_columns = [
	{ id: "interactionId", label: "interactionId" },
	{ id: "etype", label: "eventType" },
	{ id: "detail", label: "detail" },
	{ id: "startTime", label: "startTime" },
	{ id: "processingStart", label: "processingStart" },
	{ id: "processingEnd", label: "processingEnd" },
	{ id: "duration", label: "duration" }
];

function init() {
	init_shared();

	var tapTarget = document.getElementById("tap-target");
	var typeTarget = document.getElementById("type-target");

	var pointerEvents = [
		"pointerdown", "pointerup", "pointercancel",
		"click", "contextmenu"
	];
	for (var etype of pointerEvents) {
		_addEvent(tapTarget, etype, onPointerEvent.bind(null, tapTarget, etype));
	}

	var keyEvents = [
		"keydown", "keypress", "keyup", "input", "change"
	];
	for (var etype of keyEvents) {
		_addEvent(typeTarget, etype, onPointerEvent.bind(null, typeTarget, etype));
	}
}
