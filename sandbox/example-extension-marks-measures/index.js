const then = performance.now();

// These colors are a guess based on a few examples and AI generated
const COLOR = [
	"primary",
	"primary-light",
	"secondary",
	"secondary-light",
	"tertiary",
	"tertiary-light",
	"success",
	"error",
	"info",
	"warning",
];

function addCustomMeasure(name) {
	performance.measure(name, {
		start: then,
		end: performance.now(),
		detail: {
			devtools: {
				metadata: {
					extensionName: "Michal's Extension",
					dataType: "custom-measure",
				},
				color: "tertiary-light",
				track: "An Extension Track",
				hintText: "This is a rendering task",
				detailsPairs: [
					["Description", "This is a child task"],
					["Tip", "Do something about it"],
				],
			},
		},
	});
}

function addCustomMark(name) {
	performance.mark("Custom mark", {
		startTime: performance.now(),
		detail: {
			devtools: {
				metadata: {
					extensionName: "Michal's Extension",
					dataType: "custom-mark",
				},
				color: "primary",
				detailsPairs: [
					[
						"Description",
						"This marks the start of a task",
					],
				],
				hintText: "A mark",
			},
		},
	});
}


setTimeout(() => {
	addCustomMark("myMark");
}, 200);

setTimeout(() => {
	addCustomMeasure("myMeasure");
}, 100);

console.log("loaded");