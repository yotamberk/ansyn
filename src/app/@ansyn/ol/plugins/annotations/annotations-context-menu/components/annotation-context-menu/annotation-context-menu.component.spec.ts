import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnotationContextMenuComponent } from './annotation-context-menu.component';
import { DebugElement, EventEmitter } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AnnotationsColorComponent } from '../annotations-color/annotations-color.component';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { AnnotationsWeightComponent } from '../annotations-weight/annotations-weight.component';
import { ImageryCommunicatorService } from '@ansyn/imagery';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatInputModule } from '@angular/material';

describe('AnnotationContextMenuComponent', () => {
	let component: AnnotationContextMenuComponent;
	let fixture: ComponentFixture<AnnotationContextMenuComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ImageryCommunicatorService,
				{ provide: Actions, useValue: new EventEmitter() }
			],
			declarations: [
				AnnotationContextMenuComponent,
				AnnotationsWeightComponent,
				AnnotationsColorComponent,
				ColorPickerComponent
			],
			imports: [
				FormsModule,
				ColorPickerModule,
				MatInputModule
			]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AnnotationContextMenuComponent);
		component = fixture.componentInstance;
		component.mapState = <any>{ id: 'mapId' };
		spyOn(component, 'calcBoundingRect').and.returnValue({ top: `0px`, left: `0px`, width: `0px`, height: `0px`});
		spyOn(component, 'getFeatureProps').and.returnValue({});
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('click on remove feature button', () => {
		component.selection = ['featureId'];
		fixture.detectChanges();
		spyOn(component, 'removeFeature');
		const de: DebugElement = fixture.debugElement.query(By.css('button.removeFeature'));
		de.triggerEventHandler('click', {});
		expect(component.removeFeature).toHaveBeenCalledWith('featureId');
	});


});
