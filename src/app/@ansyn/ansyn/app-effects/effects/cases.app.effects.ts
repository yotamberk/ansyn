import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/do';
import '@ansyn/core/utils/debug';
import '@ansyn/core/utils/clone-deep';
import { DisplayOverlayAction, OverlaysActionTypes } from '@ansyn/overlays/actions/overlays.actions';
import {
	CasesActionTypes,
	LoadDefaultCaseIfNoActiveCaseAction,
	SelectCaseAction, SelectDilutedCaseAction
} from '@ansyn/menu-items/cases/actions/cases.actions';
import { IMapState, mapStateSelector } from '@ansyn/map-facade/reducers/map.reducer';
import { SetMapsDataActionStore } from '@ansyn/map-facade/actions/map.actions';
import { SetToastMessageAction } from '@ansyn/core/actions/core.actions';
import { ImageryCommunicatorService } from '@ansyn/imagery/communicator-service/communicator.service';
import { DilutedCase } from '@ansyn/core/models/case.model';
import { IAppState } from '@ansyn/ansyn/app-effects/app.effects.module';
import { HttpErrorResponse } from '@angular/common/http';
import { uniqBy } from 'lodash';
import { Overlay } from '@ansyn/core/models/overlay.model';
import { OverlaysService } from '@ansyn/overlays/services/overlays.service';

@Injectable()
export class CasesAppEffects {

	/**
	 * @type Effect
	 * @name onDisplayOverlay$
	 * @ofType DisplayOverlayAction
	 * @action SetMapsDataActionStore
	 * @dependencies map
	 */
	@Effect()
	onDisplayOverlay$: Observable<any> = this.actions$
		.ofType<DisplayOverlayAction>(OverlaysActionTypes.DISPLAY_OVERLAY)
		.withLatestFrom(this.store$.select(mapStateSelector))
		.map(([action, mapState]: [DisplayOverlayAction, IMapState]) => {

			const updatedMapsList = [...mapState.mapsList];
			const mapId = action.payload.mapId || mapState.activeMapId;

			updatedMapsList.forEach((map) => {
				if (mapId === map.id) {
					map.data.overlay = action.payload.overlay;
				}
			});
			return new SetMapsDataActionStore({ mapsList: updatedMapsList });
		}).share();

	/**
	 * @type Effect
	 * @name loadCase$
	 * @ofType SelectDilutedCaseAction
	 * @action SelectCaseAction?, SetToastMessageAction?, LoadDefaultCaseIfNoActiveCaseAction?
	 */
	@Effect()
	loadCase$: Observable<any> = this.actions$
		.ofType<SelectDilutedCaseAction>(CasesActionTypes.SELECT_DILUTED_CASE)
		.map(({ payload }: SelectDilutedCaseAction) => payload)
		.mergeMap((caseValue: DilutedCase) => {
			let resultObservable = Observable.of([]);

			const observablesArray = uniqBy(caseValue.state.maps.data.filter(mapData => Boolean(mapData.data.overlay))
				.map((mapData) => mapData.data.overlay)
				.concat(caseValue.state.favoriteOverlays), 'id')
				.map(({ id, sourceType }: Overlay) => this.overlaysService.getOverlayById(id, sourceType));

			if (observablesArray.length > 0) {
				resultObservable = Observable.forkJoin(observablesArray);
			}

			return resultObservable
				.map(overlays => new Map(overlays.map((overlay): [string, Overlay] => [overlay.id, overlay])))
				.map((mapOverlay: Map<string, Overlay>) => {
					caseValue.state.favoriteOverlays = caseValue.state.favoriteOverlays
						.map((favOverlay: Overlay) => mapOverlay.get(favOverlay.id));

					caseValue.state.maps.data
						.filter(mapData => Boolean(Boolean(mapData.data.overlay)))
						.forEach((map) => map.data.overlay = mapOverlay.get(map.data.overlay.id));

					return new SelectCaseAction(caseValue);
				});
		}).catch((result: HttpErrorResponse) => {
			return [new SetToastMessageAction({
				toastText: `Failed to load case (${result.status})`,
				showWarningIcon: true
			}),
				new LoadDefaultCaseIfNoActiveCaseAction()];
		});

	constructor(protected actions$: Actions,
				protected store$: Store<IAppState>,
				protected overlaysService: OverlaysService,
				protected imageryCommunicatorService: ImageryCommunicatorService) {
	}
}
