// Event Timing Viewer Options Management

var _column_info = [
	["ShowEvents", "show_", "Enabled"],
	["preventDefault", "pd_", "Prevent Default"],
	["stopPropagation", "sp_", "Stop Propagation"],
];

function createOptions(options_div, event_info, table_info, extra) {
	var table = document.createElement('table');
	table.classList.add("opttable");
	
	var thead = table.createTHead();
	var headerRow = thead.insertRow();
	headerRow.insertCell().textContent = "Event Type";
	_column_info.forEach(col => {
		var th = document.createElement('th');
		th.textContent = col[2];
		headerRow.appendChild(th);
	});

	var tbody = table.createTBody();
	event_info.forEach(event => {
		var e = event[0];
		var row = tbody.insertRow();
		var nameCell = row.insertCell();
		nameCell.textContent = e;
		nameCell.style.fontWeight = "bold";

		_column_info.forEach(col => {
			var name = col[0];
			var prefix = col[1];
			var cell = row.insertCell();
			cell.style.textAlign = "center";
			var options = event[1][name] || { checked: (name === "ShowEvents"), enabled: true };
			addOptionCheckboxRaw(cell, prefix + e, options);
		});
	});

	options_div.appendChild(table);

	if (extra && extra.length) {
		var extraDiv = document.createElement('div');
		extraDiv.style.marginTop = "20px";
		extraDiv.innerHTML = "<strong>General Options</strong><br>";
		extra.forEach(opt => {
			if (opt[0] === "text") {
				extraDiv.appendChild(document.createTextNode(opt[1]));
				extraDiv.appendChild(document.createElement("br"));
			}
		});
		options_div.appendChild(extraDiv);
	}
}

function addOptionCheckboxRaw(cell, id, options) {
    var input = document.createElement("input");
    input.type = "checkbox";
    input.id = id;
    input.checked = options.checked === undefined ? false : options.checked;
    input.disabled = options.enabled === false;
    cell.appendChild(input);
}

function toggleOptions() {
	var link = document.getElementById("optionsToggle");
	var options = document.getElementById("options");
	if (options.style.display == "block") {
		options.style.display = "none";
		link.textContent = "Show Options";
	} else {
		options.style.display = "block";
		link.textContent = "Hide Options";
	}
}
