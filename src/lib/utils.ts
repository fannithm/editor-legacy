import { Dialog } from 'quasar';

export function randomInt (min = 0, max = 9) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

export function errorHandler (e: unknown) {
	Dialog.create({
		title: 'Failed',
		message: 'For more information, please check the error message in console and contact the developer.',
		persistent: true
	});
	console.error(e);
}
