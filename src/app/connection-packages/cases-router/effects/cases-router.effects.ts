import { Injectable } from '@angular/core';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import { CasesActionTypes, LoadCaseAction, LoadDefaultCaseAction, Case } from '@ansyn/menu-items/cases';
import { isEqual as _isEqual, isNil as _isNil, get as _get, isEmpty as _isEmpty } from 'lodash';
import { RouterActionTypes } from '@ansyn/router/actions/router.actions';
import { Router } from '@angular/router';

@Injectable()
export class CasesRouterEffects {

	//from url

	@Effect()
	onUpdateLocationDefaultCase: Observable<Action> = this.actions$
		.ofType(RouterActionTypes.SET_STATE)
		.map(toPayload)
		.filter(({caseId}) => {
			return _isNil(caseId)
		})
		.withLatestFrom(this.store$.select('cases'), (payload, cases) => [payload, cases])
		.filter(([payload, cases]) => (_isEmpty(cases.selected_case) || _isEmpty(cases.default_case) || !_isEqual(cases.selected_case.id, cases.default_case.id)))
		.map(([payload]) => payload)
		.map( ({caseId, queryParams}) => {
			return new LoadDefaultCaseAction(queryParams)
		});

	@Effect()
	onUpdateLocationCase$: Observable<Action> = this.actions$
		.ofType(RouterActionTypes.SET_STATE)
		.map(toPayload)
		.filter(({caseId}) => !_isNil(caseId))
		.withLatestFrom(this.store$.select('cases'), (payload, cases) => [payload, cases])
		.filter(([payload, cases]) => payload !== _get(cases.selected_case, 'id'))
		.map(([payload]) => payload)
		.map( ({caseId}) => new LoadCaseAction(caseId));

	@Effect()
	selectCaseUpdateRouter$: Observable<any> = this.actions$
		.ofType(CasesActionTypes.SELECT_CASE_BY_ID)
		.map(toPayload)
		.withLatestFrom(this.store$.select('cases'), this.store$.select('router'), (payload, cases: any, router: any) => {
			return [payload, _get(cases.default_case, 'id'), router.caseId]
		})
		.filter(([payload, defaultCaseId, routerCaseId]) => !_isEqual(payload, defaultCaseId) && !_isEqual(payload, routerCaseId))
		.map(([payload]) => payload)
		.do(payload => {
			this.router.navigate(['case', payload]);
		});

	@Effect()
	selectDefulatCaseById$: Observable<any> = this.actions$
		.ofType(CasesActionTypes.SELECT_CASE_BY_ID)
		.map(toPayload)
		.withLatestFrom(this.store$.select('cases').pluck('default_case'),this.store$.select('router').pluck('caseId'), (payload: string, default_case: Case, caseId: string): any => [payload, _get(default_case, 'id')])
		.filter(([payload, defaultCaseId, routerCaseId]) => _isEqual(payload, defaultCaseId) && !_isEmpty(routerCaseId))
		.do(() => {
			this.router.navigate(['']);
		});

	constructor(private actions$: Actions, private store$: Store<any>, private router: Router) {}
}
