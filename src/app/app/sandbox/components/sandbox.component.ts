import { Component, OnInit } from '@angular/core';
import { AnsynApi, GeoRegisteration, IOverlay, IOverlaysCriteria, PhotoAngle } from '@ansyn/ansyn';
import { Point, Polygon } from 'geojson';
import { OpenLayersStaticImageSourceProviderSourceType, OpenLayerMarcoSourceProviderSourceType } from '@ansyn/ol';
import * as momentNs from 'moment';
import { take, tap } from 'rxjs/operators';
import { ImageryCommunicatorService } from "@ansyn/imagery";

const moment = momentNs;

@Component({
	selector: 'ansyn-sandbox',
	templateUrl: './sandbox.component.html',
	styleUrls: ['./sandbox.component.less']
})
export class SandboxComponent implements OnInit {
	overlays = [
		this.overlay('000', OpenLayersStaticImageSourceProviderSourceType, 'https://upload.wikimedia.org/wikipedia/commons/e/e2/Reeipublic_Banana.gif', 576, 1024),
		this.overlay('111', OpenLayersStaticImageSourceProviderSourceType, 'https://image.shutterstock.com/image-vector/cool-comic-book-bubble-text-450w-342092249.jpg', 470, 450),
		this.overlay('222', OpenLayersStaticImageSourceProviderSourceType, 'https://imgs.xkcd.com/comics/online_communities.png', 1024, 968),
		this.overlay('333', OpenLayersStaticImageSourceProviderSourceType, 'https://image.shutterstock.com/z/stock-vector-cool-milkshake-190524542.jpg', 1600, 1500)
	];

	overlay(id: string, sourceType: string, imageUrl: string, imageWidth: number, imageHeight: number, name?: string): IOverlay {
		const days = 10 * Math.random();
		const date = moment().subtract(days, 'day').toDate();
		const left = -117.94,
			top = 33.82,
			width = 0.05,
			height = 0.02,
			right = left + width * Math.random(),
			bottom = top - height * Math.random();
		return {
			name: id,
			id: id,
			photoTime: date.toISOString(),
			date: date,
			azimuth: 0,
			approximateTransform: 'Identity',
			isGeoRegistered: GeoRegisteration.notGeoRegistered,
			sourceType: sourceType,
			tag: {
				imageData: {
					imageWidth: imageWidth,
					imageHeight: imageHeight
				}
			},
			footprint: {
				type: 'MultiPolygon',
				coordinates: [[[
					[left, top],
					[right, top],
					[right, bottom],
					[left, bottom],
					[left, top]
				]]]
			},
			baseImageUrl: '',
			imageUrl: imageUrl,
			thumbnailUrl: '',
			sensorName: name ? name : 'mySensorName',
			sensorType: 'mySensorType',
			bestResolution: 1,
			cloudCoverage: 1,
			photoAngle: PhotoAngle.vertical
		}
	}

	constructor(protected ansynApi: AnsynApi,
				protected imageryCommunicatorService: ImageryCommunicatorService) {
	}

	ngOnInit() {
	}

	setPositionByRadius() {
		let center: Point = {
			type: 'Point',
			coordinates: [-117.914, 33.811]
		};
		this.ansynApi.setMapPositionByRadius(center, 100, true);
	}

	setPositionByRect() {
		let rect: Polygon = {
			type: 'Polygon',
			coordinates: [
				[
					[-118.02, 33.69],
					[-118.09, 33.69],
					[-118.09, 33.72],
					[-118.02, 33.72],
					[-118.02, 33.69]
				]
			]
		};
		this.ansynApi.setMapPositionByRect(rect);
	}

	setOverlayCriteria() {
		let criteria: IOverlaysCriteria = {
			region: {
				type: 'Point',
				coordinates: [-118.29, 33.60]
			}
		};
		this.ansynApi.setOverlaysCriteria(criteria);
	}

	displayOverlay() {
		this.ansynApi.displayOverLay(this.overlays[0]);
	}

	displayOverlaysOnTwoMaps() {
		this.ansynApi.changeMapLayout('layout2').pipe(
			tap(() => {
				this.ansynApi.setOverlays(this.overlays);
				this.ansynApi.displayOverLay(this.overlays[1], 0);
				this.ansynApi.displayOverLay(this.overlays[2], 1);
			}),
			take(1)
		).subscribe();
	}

	setOverlays() {
		this.ansynApi.setOverlays(this.overlays);
	}

	setLayout2maps() {
		this.ansynApi.changeMapLayout('layout2');
	}

	setMarcoOverlays() {
		const overlays = [
			this.overlay('M000', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_RGB_8bpp.j2k', 576, 1024, 'OGN_RGB_8_j2k'),
			this.overlay('M001', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_RGB_16bpp.j2k', 576, 1024, 'OGN_RGB_16_j2k'),
			this.overlay('M002', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_4Band_16bpp.tif', 576, 1024, 'OGN_4Band_16_tif'),
			this.overlay('M003', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_4Band_8bpp.tif', 576, 1024, 'OGN_4Band_8_tif'),
			this.overlay('M004', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_IR_16bpp.j2k', 576, 1024, 'OGN_IR_16bpp_j2k'),
			this.overlay('M005', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_IR_8bpp.j2k', 576, 1024, 'OGN_IR_8bpp_j2k'),
			this.overlay('M006', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/OGN_IR_8bpp.tif', 576, 1024, 'OGN_IR_8bpp_tif')// ,
			// this.overlay('M007', OpenLayerMarcoSourceProviderSourceType, 's3://mp-images/14DEC08015334-S2AS_R1C1-054168615010_01_P001.TIF', 576, 1024, '14DEC08015334_tif')
		];
		this.ansynApi.setOverlays(overlays);
	}

	loadImageToCesium() {

	}
}
