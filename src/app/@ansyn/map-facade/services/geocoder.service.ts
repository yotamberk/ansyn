import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { IMapFacadeConfig, IMapSearchConfig } from '../models/map-config.model';
import { mapFacadeConfig } from '../models/map-facade.config';
import { catchError, map } from 'rxjs/operators';
import { SetToastMessageAction } from '../actions/map.actions';

@Injectable()
export class GeocoderService {

	public config: IMapSearchConfig = null;

	constructor(protected http: HttpClient,
				@Inject(mapFacadeConfig) public packageConfig: IMapFacadeConfig) {
		this.config = this.packageConfig.mapSearch;
	}

	getLocation$(searchString): Observable<any> {
		const url = this.config.url.replace('$searchString', searchString).replace('$apiKey', this.config.apiKey);
		return this.http.get<any>(url).pipe(
			map(res => res.resourceSets[0].resources[0]),
			map(res => res ? { ...res.point, coordinates: res.point.coordinates.reverse() } : null),
			catchError((error: Response | any) => {
				console.warn(error);
				return of(new SetToastMessageAction({ toastText: 'Connection Problem', showWarningIcon: true }));
			})
		);
	}

}
