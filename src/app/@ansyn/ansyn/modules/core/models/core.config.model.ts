import { IStorageConfig } from '../services/storage/config';

export interface ICoreConfig {
	storageService: IStorageConfig;
	noInitialSearch?: boolean;
	translation: {
		default: any,
		[key: string]: any
	};
	httpTimeout: number;
}
