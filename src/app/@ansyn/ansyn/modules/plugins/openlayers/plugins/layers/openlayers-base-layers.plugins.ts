import { Store } from '@ngrx/store';
import TileLayer from 'ol/layer/Tile';
import { filter, map, tap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { BaseImageryPlugin } from '@ansyn/imagery';
import { MapFacadeService, selectMapsList } from '@ansyn/map-facade';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { AutoSubscription } from 'auto-subscriptions';
import { OpenLayersMap } from '@ansyn/ol';
import { ILayer } from '../../../../menu-items/layers-manager/models/layers.model';
import { selectSelectedLayersIds } from '../../../../menu-items/layers-manager/reducers/layers.reducer';
import { selectLayers } from '../../../../menu-items/layers-manager/reducers/layers.reducer';
import { ICaseMapState } from '../../../../menu-items/cases/models/case.model';

export abstract class OpenlayersBaseLayersPlugins extends BaseImageryPlugin {

	@AutoSubscription
	toggleGroup$ = this.store$.select(selectMapsList).pipe(
		map((mapsList) => MapFacadeService.mapById(mapsList, this.mapId)),
		filter(Boolean),
		map((map: ICaseMapState) => !map.flags.displayLayers),
		distinctUntilChanged(),
		debounceTime(50),
		tap((newState: boolean) => this.iMap.toggleGroup('layers', newState))
	);

	@AutoSubscription
	osmLayersChanges$: Observable<any[]> = combineLatest(this.store$.select(selectLayers), this.store$.select(selectSelectedLayersIds))
		.pipe(
			tap(([result, selectedLayerId]: [ILayer[], string[]]) => {
				result.filter(this.checkLayer)
					.forEach((layer: ILayer) => {
						if (selectedLayerId.includes(layer.id)) {
							this.addGroupLayer(layer);
						} else {
							this.removeGroupLayer(layer.id);
						}
					});
			})
		);

	protected constructor(protected store$: Store<any>) {
		super();
	}

	abstract checkLayer(layer: ILayer);

	abstract createLayer(layer: ILayer): TileLayer;

	addGroupLayer(layer: ILayer) {
		const group = OpenLayersMap.groupLayers.get(OpenLayersMap.groupsKeys.layers);
		const layersArray = group.getLayers().getArray();
		if (!layersArray.some((shownLayer) => shownLayer.get('id') === layer.id)) {
			const _layer = this.createLayer(layer);
			group.getLayers().push(_layer);
		}
	}

	removeGroupLayer(id: string): void {
		const group = OpenLayersMap.groupLayers.get(OpenLayersMap.groupsKeys.layers);
		const layersArray: any[] = group.getLayers().getArray();
		let removeIdx = layersArray.indexOf(layersArray.find(l => l.get('id') === id));
		if (removeIdx >= 0) {
			group.getLayers().removeAt(removeIdx);
		}
	}

}
