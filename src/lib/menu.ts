export interface IMenuItem {
	// necessary for non-separator
	key?: string;
	// icon to display, default is null
	icon?: string;
	/**
	 * start with $ if you want to use i18n key to display, default is the key of the object,
	 * such as `$i18nKey.parent_key.key.label` if submenu is passed, else `$i18nKey.parent_key.key`
	 */
	label?: string;
	// show `...` after label, default is false
	followingStep?: boolean;
	// hot key display
	hotkey?: string;
	// when to display, default is true
	display?: boolean | 'map' | 'project' | (() => boolean);
	// when to enable, default is true
	enable?: boolean | 'map' | 'project' | (() => boolean);
	// sub menu, default is null
	menu?: IMenu;
	// add a separator after this item, default is false
	separator?: boolean;
	// will be triggered when item is clicked if item doesn't have a submenu
	onClick?: () => void;
}

export type IMenu = IMenuItem[];
