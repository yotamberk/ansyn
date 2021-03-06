import { NgModule } from '@angular/core';
import { HelpComponent } from './components/help.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { HelpLocalStorageService } from './services/help.local-storage.service';
import { HelpEffects } from './effects/help.effects';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';

@NgModule({
	imports: [
		CoreModule,
		CommonModule,
		FormsModule,
		CarouselModule.forRoot(),
		EffectsModule.forFeature([HelpEffects])
	],
	providers: [HelpLocalStorageService],
	declarations: [HelpComponent],
	entryComponents: [HelpComponent]
})
export class HelpModule {
}
