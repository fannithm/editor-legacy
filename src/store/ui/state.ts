export interface UIStateInterface {
	window: {
		new: boolean;
	}
}

function state (): UIStateInterface {
	return {
		window:{
			new: false
		}
	};
}

export default state;
