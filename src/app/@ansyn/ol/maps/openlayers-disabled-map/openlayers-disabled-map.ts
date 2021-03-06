import { Observable, of } from 'rxjs';
import Map from 'ol/Map';
import View from 'ol/View';
import Layer from 'ol/layer/Layer';
import { ImageryMapPosition } from '@ansyn/imagery';
import { GeoJsonObject, Point } from 'geojson';
import { BaseImageryMap, IMAGERY_MAIN_LAYER_NAME, ImageryLayerProperties, ImageryMap } from '@ansyn/imagery';
import * as olShared from '../open-layers-map/shared/openlayers-shared';

export const DisabledOpenLayersMapName = 'disabledOpenLayersMap';

@ImageryMap({
	mapType: DisabledOpenLayersMapName
})
export class OpenLayersDisabledMap extends BaseImageryMap<Map> {
	mainLayer: Layer;

	initMap(element: HTMLElement, shadowNorthElement: HTMLElement, shadowDoubleBufferElement: HTMLElement, mainLayer: any, position?: ImageryMapPosition): Observable<boolean> {
		this.mapObject = new Map({
			target: element,
			renderer: 'canvas',
			controls: []
		});
		this.setMainLayer(mainLayer, position);
		return of(true);
	}

	addLayerIfNotExist(layer: any) {
	}

	toggleGroup(groupName: string, newState: boolean) {
	}

	getLayers(): any[] {
		return this.mapObject.getLayers().getArray();
	}

	public getCenter(): Observable<Point> {
		return of(null);
	}

	setCenter(center: Point, animation: boolean): Observable<boolean> {
		return of(true);
	}


	resetView(layer: any, position?: ImageryMapPosition): Observable<boolean> {
		this.setMainLayer(layer, position);
		return of(true);
	}

	setMainLayer(layer: Layer, position?: ImageryMapPosition) {
		this.removeMainLayer();
		const view = this.generateNewView(layer, position);
		this.mapObject.setView(view);
		this.mainLayer = layer;
		this.mainLayer.set(ImageryLayerProperties.NAME, IMAGERY_MAIN_LAYER_NAME);
		this.mapObject.addLayer(this.mainLayer);
		const layerExtent = this.mainLayer.getExtent();
		if (layerExtent) {
			this.fitToMainLayerExtent(layerExtent);
		}
	}

	getMainLayer() {
		return this.mainLayer;
	}

	generateNewView(layer: Layer, position?: ImageryMapPosition): View {
		const newProjection = layer.getSource().getProjection();

		// for outside only
		if (position && position.projectedState.projection.code === newProjection.getCode()) {
			return new View({
				projection: newProjection,
				center: position.projectedState.center,
				zoom: position.projectedState.zoom,
				rotation: position.projectedState.rotation
			});
		}
		return new View({
			projection: newProjection
		});
	}

	fitToMainLayerExtent(extent: [number, number, number, number]) {
		const view = this.mapObject.getView();
		view.fit(extent, {
			size: this.mapObject.getSize(),
			constrainResolution: false
		});
	}

	addLayer(layer: Layer): void {
		this.mapObject.addLayer(layer);
	}

	removeMainLayer() {
		if (this.mainLayer) {
			this.removeLayer(this.mainLayer);
			this.mainLayer = null;
		}
	}

	removeLayer(layer: any): void {
		olShared.removeWorkers(layer);
		this.mapObject.removeLayer(layer);
		this.mapObject.renderSync();
	}

	setPosition(position: ImageryMapPosition): Observable<boolean> {
		return of(true);
	}

	getPosition(): Observable<ImageryMapPosition> {
		return of(undefined);
	}

	public setRotation(rotation: number, view: View = this.mapObject.getView()) {
		view.setRotation(rotation);
	}

	updateSize(): void {
		this.mapObject.updateSize();
	}

	addGeojsonLayer(data: GeoJsonObject): void {
	}

	setPointerMove(enable: boolean) {
	}

	getPointerMove() {
		return new Observable();
	}

	getRotation(): number {
		return this.mapObject.getView().getRotation();
	}

	dispose() {
		if (this.mapObject) {
			this.removeMainLayer();
			this.mapObject.setTarget(null);
		}
	}
}
