import { Store } from '@ngrx/store';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MapFacadeService, mapStateSelector } from '@ansyn/map-facade';
import { selectIsPinned } from '@ansyn/menu';
import { select } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { Inject } from '@angular/core';
import { COMPONENT_MODE } from '../app-providers/component-mode';
import { selectSelectedCase } from '../modules/menu-items/cases/reducers/cases.reducer';
import { LoadDefaultCaseAction } from '../modules/menu-items/cases/actions/cases.actions';
import { ICase, ICaseMapState } from '../modules/menu-items/cases/models/case.model';

@Component({
	selector: 'ansyn-app',
	templateUrl: './ansyn.component.html',
	styleUrls: ['./ansyn.component.less']
})

export class AnsynComponent implements OnInit {
	renderContextMenu: boolean;

	selectedCaseName$: Observable<string> = this.store$
		.pipe(
			select(selectSelectedCase),
			map((selectSelected: ICase) => selectSelected ? selectSelected.name : 'Default Case')
		);

	isPinnedClass$: Observable<string> = this.store$.select(selectIsPinned).pipe(
		map((_isPinned) => _isPinned ? 'isPinned' : 'isNotPinned')
	);

	activeMap$: Observable<ICaseMapState> = this.store$
		.pipe(
			select(mapStateSelector),
			filter(Boolean),
			map(MapFacadeService.activeMap),
			filter(Boolean)
		);

	@HostBinding('class.component') component = this.componentMode;
	@Input() version;

	constructor(protected store$: Store<any>, @Inject(COMPONENT_MODE) public componentMode: boolean) {
		if (componentMode) {
			store$.dispatch(new LoadDefaultCaseAction());
		}
	}
	ngOnInit(): void {
		setTimeout(() => {
			this.renderContextMenu = true;
		}, 1000);

	}
}
