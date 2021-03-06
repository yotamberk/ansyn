export interface IMapSearchConfig {
	active: boolean;
	url: string;
	apiKey: string;
}

export interface IMapFacadeConfig {
	displayDebounceTime: number;
	overlayCoverage: number;
	sensorTypeShortcuts: Object;
	contextMenu: {
		filterField: string;
	};
	mapSearch: IMapSearchConfig;
	sourceTypeNotices: {
		[propName: string]: string
	};
	welcomeNotification: {
		headerText: string;
		mainText: string;
	};
}


