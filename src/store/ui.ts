import { reactive } from 'vue';

export interface UIStateInterface {
	window: {
		newProject: boolean;
		openProject: boolean;
		newMap: boolean;
		resourceManager: boolean;
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

const uiState = reactive<UIStateInterface>({
	window: {
		newProject: false,
		openProject: false,
		newMap: false,
		resourceManager: false
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
});


export default uiState;

