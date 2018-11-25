import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksFormComponent } from './tasks-form.component';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { AnsynFormsModule, coreFeatureKey, CoreReducer, Overlay } from '@ansyn/core';
import { TranslateModule } from '@ngx-translate/core';
import { TasksService } from '../../services/tasks.service';
import { EffectsModule } from '@ngrx/effects';
import { TasksRemoteService } from '../../services/tasks-remote.service';
import { tasksFeatureKey, TasksReducer } from '../../reducers/tasks.reducer';

describe('TasksFormComponent', () => {
	let component: TasksFormComponent;
	let fixture: ComponentFixture<TasksFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TasksFormComponent
			],
			imports: [
				FormsModule,
				AnsynFormsModule,
				TranslateModule.forRoot(),
				StoreModule.forRoot({ [tasksFeatureKey]: TasksReducer, [coreFeatureKey]: CoreReducer }),
				EffectsModule.forRoot([])
			],
			providers: [
				{
					provide: TasksService,
					useValue: {
						config: {
							algorithms: {}
						}
					}
				},
				{
					provide: TasksRemoteService,
					useValue: {}
				}
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TasksFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('checkForErrors()', () => {
		let overlays: Overlay[];
		beforeEach(() => {
			spyOn(component, 'showError');
			overlays = ['a', 'b'].map((id) => new Overlay({ id: id }));
			component.MIN_NUM_OF_OVERLAYS = 2;
			component.tasksService.config = {
				schema: '',
				paginationLimit: 1,
				algorithms: {
					alg_1: {
						maxOverlays: 2,
						timeEstimationPerOverlayInMinutes: 10,
						regionLengthInMeters: 100,
						sensorNames: []
					}
				}
			};
			component.task = {
				id: '21',
				creationTime: null,
				runTime: null,
				name: '21',
				type: 'alg_1',
				status: 'Sent',
				state: {
					overlays: overlays,
					masterOverlay: overlays[0],
					region: {
						type: 'Point'
					}
				}
			}
		});
		it('should set empty message by default', () => {
			component.checkForErrors();
			expect(component.showError).toHaveBeenCalledWith('');
		});
		it('should check minimum no. of overlays', () => {
			overlays.pop();
			component.checkForErrors();
			expect(component.showError).toHaveBeenCalledWith(`The number of selected overlays 1 should be at least 2`);
		});
		it('should check maximum no. of overlays', () => {
			overlays.push(new Overlay({}));
			component.checkForErrors();
			expect(component.showError).toHaveBeenCalledWith(`The number of selected overlays 3 should be at most 2`);
		});
		it('should check existence of master overlay', () => {
			component.task.state.masterOverlay = null;
			component.checkForErrors();
			expect(component.showError).toHaveBeenCalledWith('No master overlay selected');
		});
	});
});