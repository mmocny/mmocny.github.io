
// import workerize from 'workerize';
// function withinWorker() {
// 	return Math.random();
// }
// const fn = workerize(withinWorker);

import { FpsTracker } from "./FpsTracker";

export async function fpsMeter() {
	const fpsTracker = new FpsTracker;
	fpsTracker.addEventListener('fps', (e) => {
		console.log('fps', e.detail.fps);
	});

}

export default fpsMeter;