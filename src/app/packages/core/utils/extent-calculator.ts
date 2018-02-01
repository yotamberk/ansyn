import { CaseMapExtentPolygon } from '@ansyn/core/models/case-map-position.model';
import { toRadians } from './math';
import { cloneDeep } from 'lodash';
import * as turfCenter from '@turf/center';
import { CaseMapExtent } from '@ansyn/core';

export class ExtentCalculator {

	static polygonToExtent(extentPolygon: CaseMapExtentPolygon): CaseMapExtent {
		return <CaseMapExtent> [...extentPolygon.coordinates[0][0], ...extentPolygon.coordinates[0][2]];
	}

	static transform(transFunc, extentPolygon: CaseMapExtentPolygon, source, destination): CaseMapExtentPolygon {
		const transformExtent = cloneDeep(extentPolygon);
		transformExtent.coordinates = [
			transformExtent.coordinates[0].map((point: [number, number]) => transFunc(point, source, destination))
		];
		return transformExtent;
	}

	static calcRotation(extentPolygon: CaseMapExtentPolygon) {
		// topLeft , topRight
		const [[[x1, y1], [x2, y2]]] = extentPolygon.coordinates;
		let theta = Math.atan2(x1 - x2, y1 - y2);
		theta += Math.PI / 2.0;
		const radRotate = toRadians(360);
		return (radRotate - theta) % radRotate;
	}

	static calcCenter(extentPolygon: CaseMapExtentPolygon): ol.Coordinate {
		const type = 'Feature';
		const properties = {};
		const geometry = extentPolygon;
		return <ol.Coordinate> turfCenter({ type, geometry, properties }).geometry.coordinates;
	}

	static calcResolution(extentPolygon: CaseMapExtentPolygon, mapSize: [number, number], rotation: number) {
		const [width, height] = mapSize;
		const [[topLeft, topRight, bottomRight, bottomLeft]] = extentPolygon.coordinates;
		const size = width * Math.cos(rotation) + height * Math.sin(rotation);
		const xWidth = bottomRight[0] - topLeft[0];
		return xWidth / size;
	}

}