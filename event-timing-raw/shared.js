// Event Timing Viewer Shared Logic and Table Management

var _pointer_event_info = [
	["pointerdown", {}],
	["pointerup", {}],
	["pointercancel", {}],
	["click", {}],
	["contextmenu", {}],
	["keydown", {}],
	["keypress", {}],
	["keyup", {}],
	["input", {}],
	["change", {}],
];

var _event_map = new Map();
var _lastEventStartTime = 0;
var _clusterTimer = null;
const CLUSTER_TIMEOUT_MS = 500;
const MAX_ROWS = 100;

// Essential Table Helpers
function clearChildren(e) { while (e.firstChild) e.removeChild(e.firstChild); }
function setText(e, text) { clearChildren(e); e.appendChild(document.createTextNode(text)); }
function _addEvent(obj, etype, handler) { if (obj) obj.addEventListener(etype, handler, false); }

function init_shared() {
	createOptions(document.getElementById("options"), _pointer_event_info, [], [
		["text", "Note: Options apply to new events only."],
	]);
	resetTable();
	init_event_timing();
}

function resetTable() {
	var table = document.getElementById("output");
	clearChildren(table);
	_event_map.clear();
	_lastEventStartTime = 0;
	if (_clusterTimer) clearTimeout(_clusterTimer);

	// Create Single Header Row
	var thead = table.createTHead();
	var row = thead.insertRow();
	for (var col of _table_columns) {
		var th = document.createElement('th');
		th.textContent = col.label;
        th.className = "subheader"; // For mobile vertical styles
		row.appendChild(th);
	}
	table.createTBody();
}

function init_event_timing() {
	if (typeof PerformanceObserver === "undefined") return;
	const observer = new PerformanceObserver((list) => {
		for (const entry of list.getEntries()) {
			const key = entry.startTime + ":" + entry.name;
			const rows = _event_map.get(key);
			if (rows) rows.forEach(row => updateRowWithEventTiming(row, entry));
		}
	});
	observer.observe({ type: "event", buffered: true, durationThreshold: 0 });
}

function updateRowWithEventTiming(row, entry) {
	const startTimeDelta = _lastEventStartTime ? (entry.startTime - _lastEventStartTime) : 0;
	_lastEventStartTime = entry.startTime;
	
	const pStartDelta = entry.processingStart - entry.startTime;
	const pEndDelta = entry.processingEnd - entry.processingStart;

    const updateCell = (cellId, val, isDelta = false) => {
        const idx = _table_columns.findIndex(c => c.id === cellId);
        if (idx === -1) return;
        const cell = row.cells[idx];
        
        let text = val;
        if (typeof val === 'number') {
            text = isDelta ? (val >= 0 ? "+" + val.toFixed(2) : val.toFixed(2)) : val.toFixed(2);
        }
        
        setText(cell, text);
        if (isDelta && typeof val === 'number' && val < 0) {
            cell.style.fontWeight = "bold";
            cell.style.color = "#dc3545";
        }
    };

    updateCell("interactionId", entry.interactionId ? Math.floor(entry.interactionId).toString() : "-");
    updateCell("startTime", startTimeDelta, true);
    updateCell("processingStart", pStartDelta, true);
    updateCell("processingEnd", pEndDelta, true);
    updateCell("duration", entry.duration);
}

function onPointerEvent(handler, etype, e) {
    if (document.getElementById("add-jank").checked) {
        var start = performance.now();
        while (performance.now() - start < 200) {}
    }

	if (document.getElementById("show_" + etype).checked) {
		const row = addEventToTable(etype, e);
		const key = e.timeStamp + ":" + e.type;
		if (!_event_map.has(key)) _event_map.set(key, []);
		_event_map.get(key).push(row);
		setTimeout(() => _event_map.delete(key), 30000);
	}

    // Default Propagation handling
    if (document.getElementById("pd_" + etype)?.checked) e.preventDefault();
    if (document.getElementById("sp_" + etype)?.checked) e.stopPropagation();
	
	if (_clusterTimer) clearTimeout(_clusterTimer);
	_clusterTimer = setTimeout(() => {
        var tbody = document.getElementById("output").tBodies[0];
        if (tbody?.rows.length && !tbody.rows[0].classList.contains('cluster-spacer')) {
            var row = tbody.insertRow(0);
            row.classList.add('cluster-spacer');
            var cell = row.insertCell();
            cell.colSpan = _table_columns.length;
        }
	}, CLUSTER_TIMEOUT_MS);
}

function addEventToTable(etype, e) {
    var tbody = document.getElementById("output").tBodies[0];
	while (tbody.rows.length >= MAX_ROWS) tbody.deleteRow(-1);
	var row = tbody.insertRow(0);

    var identifier = (e instanceof KeyboardEvent) ? e.key : 
                     (etype === "input" || etype === "change") ? (e.inputType || "") : 
                     (e.pointerId !== undefined) ? e.pointerId : "";

    // Mapping event types to compact icons
    const iconMap = {
        "pointerdown": "👆↓",
        "pointerup": "👆↑",
        "pointercancel": "👆✕",
        "click": "🖱️✓",
        "contextmenu": "🖱️☰",
        "keydown": "⌨️↓",
        "keypress": "⌨️✱",
        "keyup": "⌨️↑",
        "input": "📝✍️",
        "change": "📝🔄"
    };
    var eventIcon = iconMap[etype] || etype;

    var data = {
        interactionId: "",
        etype: eventIcon,
        detail: identifier,
        startTime: "",
        processingStart: "",
        processingEnd: "",
        duration: ""
    };

    _table_columns.forEach(col => {
        var cell = row.insertCell();
        cell.className = "field_" + col.id;
        if (col.id === 'etype') {
            cell.title = etype; // Keep original name in tooltip
        }
        setText(cell, data[col.id] || "-");
    });
	
	return row;
}
