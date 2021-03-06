import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { IStatusBarState } from '../../reducers/status-bar.reducer';
import { Store } from '@ngrx/store';
import { isEqual } from 'lodash';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap, take } from 'rxjs/operators';
import { SetToastMessageAction } from '@ansyn/map-facade';
import { SetOverlaysCriteriaAction } from '../../../overlays/actions/overlays.actions';
import { selectDataInputFilter } from '../../../overlays/reducers/overlays.reducer';
import {
	IMultipleOverlaysSourceConfig,
	IOverlaysSourceProvider,
	MultipleOverlaysSourceConfig
} from '../../../core/models/multiple-overlays-source-config';
import { IDataInputFilterValue } from '../../../menu-items/cases/models/case.model';

@Component({
	selector: 'ansyn-tree-view',
	templateUrl: './tree-view.component.html',
	styleUrls: ['./tree-view.component.less']
})
export class TreeViewComponent implements OnInit, OnDestroy {
	@Output() closeTreeView = new EventEmitter<any>();
	_selectedFilters: IDataInputFilterValue[];
	dataInputFiltersItems: TreeviewItem[] = [];
	leavesCount: number;

	dataInputFilter$: Observable<any> = this.store.select(selectDataInputFilter);

	onDataInputFilterChange$ = this.dataInputFilter$.pipe(
		filter(Boolean),
		tap(_preFilter => {
			this._selectedFilters = _preFilter.filters;
			this.dataInputFiltersActive = _preFilter.active;
			if (Boolean(this._selectedFilters)) {
				this.dataInputFiltersItems.forEach(root => this.updateInputDataFilterMenu(root));
			}
		})
	);

	dataInputFiltersConfig = TreeviewConfig.create({
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false, // Collapse (show all filters).
		decoupleChildFromParent: false,
		maxHeight: 400
	});

	private subscribers = [];
	public dataInputFiltersActive: boolean;

	constructor(@Inject(MultipleOverlaysSourceConfig) public multipleOverlaysSourceConfig: IMultipleOverlaysSourceConfig,
				public store: Store<IStatusBarState>,
				private translate: TranslateService) {

		this.dataFilters.forEach((f) => {
			translate.get(f.text).subscribe((res: string) => {
				f.text = res;
				this.dataInputFiltersItems.push(new TreeviewItem(f));
			});
		});
	}

	set selectedFilters(value) {
		this._selectedFilters = value;
	}

	get dataFilters(): TreeviewItem[] {
		this.leavesCount = 0;
		return Object.entries(this.multipleOverlaysSourceConfig.indexProviders)
			.filter(([providerName, { inActive, dataInputFiltersConfig }]: [string, IOverlaysSourceProvider]) => !inActive && dataInputFiltersConfig)
			.map(([providerName, { dataInputFiltersConfig }]: [string, IOverlaysSourceProvider]) => {
					this.visitLeafes(dataInputFiltersConfig, (leaf) => {
						this.leavesCount++;
						leaf.value.providerName = providerName;
						if (leaf.text) {
							this.translate.get(leaf.text).pipe(take(1)).subscribe((res: string) => {
								leaf.text = res;
							});
						}
					});
					return dataInputFiltersConfig;
				}
			);
	}

	visitLeafes(curr: TreeviewItem, cb: (leaf: TreeviewItem) => void) {
		if (Boolean(curr.children)) {
			curr.children.forEach(c => this.visitLeafes(c, cb));
			return;
		}
		cb(curr);
	}

	updateFiltersTreeActivation(disabled: boolean = !this.dataInputFiltersActive): void {
		this.dataInputFiltersItems.forEach((dataInputItem) => {
			dataInputItem.disabled = disabled;
			dataInputItem.children.forEach((sensor) => {
				sensor.disabled = disabled;
			});
		});
	}


	setSubscribers() {
		this.subscribers.push(
			this.dataInputFilter$.subscribe(),
			this.onDataInputFilterChange$.subscribe()
		);
	}

	updateInputDataFilterMenu(curr: TreeviewItem): void {
		if (!Boolean(this._selectedFilters)) {
			return;
		}

		if (this.isLeaf(curr)) {
			curr.checked = this._selectedFilters.some(selectedFilter => isEqual(selectedFilter, curr.value));
			return;
		}
		curr.children.forEach(c => this.updateInputDataFilterMenu(c));
		curr.checked = this.treeViewNodeStatus(curr);
	}

	isLeaf(node: TreeviewItem) {
		return !(Array.isArray(node.children) && node.children.length > 0);
	}

	treeViewNodeStatus(node: TreeviewItem): boolean {
		return node.children.every(child => child.checked) ? true : node.children.some(child => child.checked || child.checked === undefined) ? undefined : false;
	}

	dataInputFiltersOk(): void {
		if (this._selectedFilters.length === 0 && this.dataInputFiltersActive) {
			this.store.dispatch(new SetToastMessageAction({
				toastText: 'Please select at least one sensor'
			}));
		} else {
			this.store.dispatch(new SetOverlaysCriteriaAction({
				dataInputFilters: {
					fullyChecked: this.leavesCount <= this._selectedFilters.length,
					filters: this._selectedFilters,
					active: this.dataInputFiltersActive
				}
			}));
			this.closeTreeView.emit();
		}
	}

	ngOnInit(): void {
		this.setSubscribers();
		this.updateFiltersTreeActivation();
	}

	ngOnDestroy(): void {
		this.subscribers.forEach(sub => sub.unsubscribe());
	}

	onTreeViewClose(): void {
		this.closeTreeView.emit();
	}

	activateDataInputFilters($event) {
		this.dataInputFiltersActive = !this.dataInputFiltersActive;
		this.updateFiltersTreeActivation();
	}
}
