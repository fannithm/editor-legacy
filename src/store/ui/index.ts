import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { UIStateInterface } from './state';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const uiModule: Module<UIStateInterface, StateInterface> = {
	namespaced: true,
	actions,
	getters,
	mutations,
	state
};

export default uiModule;
