import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimelineComponent } from './timeline/timeline.component';
import { TimelineEmitterService } from './services/timeline-emitter.service';
import { OverlaysContainerComponent } from './container/overlays-container.component';
import { IOverlaysConfig } from './models/overlays.config';

import { OverlaysConfig, OverlaysService } from './services/overlays.service';
import { OverlaysEffects } from './effects/overlays.effects';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { OverlayReducer, overlaysFeatureKey } from './reducers/overlays.reducer';

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		StoreModule.forFeature(overlaysFeatureKey, OverlayReducer),
		EffectsModule.forFeature([OverlaysEffects])
	],

	declarations: [
		TimelineComponent,
		OverlaysContainerComponent
	],
	exports: [OverlaysContainerComponent, TimelineComponent],
	providers: [
		OverlaysService,
		TimelineEmitterService
	]

})
export class OverlaysModule {
	static forRoot(config: IOverlaysConfig): ModuleWithProviders {
		return {
			ngModule: OverlaysModule,
			providers: [
				OverlaysService,
				TimelineEmitterService,
				{ provide: OverlaysConfig, useValue: config }
			]
		};
	}
}


