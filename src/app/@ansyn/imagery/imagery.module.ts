import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageryComponent } from './imagery-component/imagery.component';
import { ImageryCommunicatorService } from './communicator-service/communicator.service';
import { ImageryProviderService } from './provider-service/imagery-provider.service';
import { IImageryConfig } from './model/iimagery-config';
import { ConfigurationToken } from './configuration.token';
import { CacheService } from '@ansyn/imagery/cache-service/cache.service';

@NgModule({
	imports: [CommonModule],
	declarations: [ImageryComponent],
	providers: [ImageryCommunicatorService, ImageryProviderService, CacheService],
	exports: [ImageryComponent]
})
export class ImageryModule {

	static forRoot(config: IImageryConfig): ModuleWithProviders {
		return {
			ngModule: ImageryModule,
			providers: [
				ImageryCommunicatorService,
				ImageryProviderService,
				{ provide: ConfigurationToken, useValue: config }
			]
		};
	}
}