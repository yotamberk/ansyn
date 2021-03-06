import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { MultipleOverlaysSourceConfig } from '@ansyn/ansyn';
import { MAP_SOURCE_PROVIDERS_CONFIG } from '@ansyn/imagery';
import { StoreModule } from '@ngrx/store';
import { sentinelFeatureKey, SentinelReducer } from '../reducers/sentinel.reducer';
import { SentinelLayersService } from './sentinel-layers.service';
import { of } from 'rxjs/internal/observable/of';

describe('SentinelLayersService', () => {
	let httpClient: HttpClient;
	let sentinelLayersService: SentinelLayersService;

	beforeEach(() => TestBed.configureTestingModule({
		imports: [HttpClientModule,
			StoreModule.forRoot({[sentinelFeatureKey]: SentinelReducer})],
		providers: [{
			provide: MAP_SOURCE_PROVIDERS_CONFIG,
			useValue: {SENTINEL: {}}
		},
			{
				provide: MultipleOverlaysSourceConfig,
				useValue: {
					indexProviders: {SENTINEL: {}}
				}
			}]
	}));

	beforeEach(inject([HttpClient], (_httpClient: HttpClient) => {
		httpClient = _httpClient;
		spyOn(httpClient, 'get').and.callFake(() => of(''));
	}));

	beforeEach(inject([SentinelLayersService], (_sentinelLayersService: SentinelLayersService) => {
		sentinelLayersService = _sentinelLayersService;
	}));

	it('should be created', () => {
		expect(sentinelLayersService).toBeTruthy();
	});

});
