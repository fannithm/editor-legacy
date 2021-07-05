export interface UIStateInterface {
	window: {
		new: boolean;
		open: boolean;
	}
}

function state (): UIStateInterface {
	return {
		window: {
			new: false,
			open: false
		}
	};
}

export default state;
