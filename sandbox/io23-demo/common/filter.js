const fs = require('fs');
const file = fs.readFileSync('./all_sailboats_orig.json');

function getSailDataKeys() {
	return [
		'builder',
		'designer',
		'disp', 
		'disp-len', 
		'draft-max', 
		'first-built', 
		'last-built',
		'hull-type', 
		'id', 
		'loa', 
		'lwl', 
		'name',
	];
}

function filter(key, value) {
  if (key == '')
    return value;
  if (typeof key == 'number')
    return value;
  if (!isNaN(key) && !isNaN(parseFloat(key)))
    return value;
  if (getSailDataKeys().includes(key))
    return value;
}
const contents = JSON.parse(file, filter);

const json = JSON.stringify(contents, null, 2);

fs.writeFileSync('./all_sailboats.json', json);
