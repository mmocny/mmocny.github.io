// Thanks: https://jameshfisher.com/2017/10/30/web-cryptography-api-hello-world/

export default async function sha256(str) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder("utf-8").encode(str));
	return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}