let currentId = 0;
const map = new WeakMap();

export default function objectId(obj: any) {
	if (!map.has(obj)) {
		map.set(obj, ++currentId);
	}
	return map.get(obj);
}