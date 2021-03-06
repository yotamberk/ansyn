import { Action } from '@ngrx/store';

export enum SettingsActionsTypes {
	SET_ANAGLYPH_STATE = '[Settings] Set Anaglyph State'
}

export class SetAnaglyphStateAction implements Action {
	readonly type = SettingsActionsTypes.SET_ANAGLYPH_STATE;

	constructor(public payload: boolean) {
	}

}

export type SettingsActions = SetAnaglyphStateAction;
