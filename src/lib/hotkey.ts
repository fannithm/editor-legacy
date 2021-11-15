const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const keys = {
	'file/save': [
		['ctrl', 's'],
		['⌘', 's']
	],
	'file/resourceManager': [
		['ctrl', 'm'],
		['⌘', 'm']
	]
};

const hotkeys = Object.fromEntries(Object.entries(keys).map(([key, value]) => {
	return [key, value[isMac ? 1 : 0]];
}));

export default hotkeys;

function titleCase(str: string) {
	return str[0].toUpperCase() + str.substr(1).toLowerCase();
}

export function formatAsDisplay(key: string[]) {
	return key.map(v => titleCase((v))).join(isMac ? '' : '+');
}

export function formatAsBind(key: string[]) {
	return key.join('+');
}
