export interface UIStateInterface {
	window: {
		new: boolean;
		open: boolean;
	},
	bar: {
		showMenuBar: boolean
		toolbar: {
			icon: string;
			label: string;
			action: string;
		}[]
	}
}

function state (): UIStateInterface {
	return {
		window: {
			new: false,
			open: false
		},
		bar: {
			showMenuBar: false,
			toolbar: [
				{
					label: 'Save',
					icon: 'mdi-content-save',
					action: 'file/save'
				}
			]
		}
	};
}

export default state;
