import { Component, HostListener, Input } from '@angular/core';
import { ComboBoxComponent } from '../combo-box/combo-box.component';

@Component({
	selector: 'ansyn-combo-box-option',
	templateUrl: './combo-box-option.component.html',
	styleUrls: ['./combo-box-option.component.less']
})
export class ComboBoxOptionComponent {
	@Input() value;

	@HostListener('click') onClick() {
		this._parent.selectOption(this.value);
	}

	get selected() {
		return this._parent.selected;
	}

	constructor(protected _parent: ComboBoxComponent) {
	}
}