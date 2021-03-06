import { ICoordinatesSystem } from '../../../core/models/coordinate-system.model';

export interface IEd50Notification {
	href?: string;
	title: string;
	hrefText?: string;
}

export interface IShadowMouseConfig {
	activeByDefault: boolean
}

export interface IToolsConfig {
	GoTo: {
		from: ICoordinatesSystem;
		to: ICoordinatesSystem;
	},
	Proj4: {
		ed50: string;
		ed50Customized: string;
		ed50Notification: IEd50Notification;
	},
	ImageProcParams: Array<IImageProcParam>,
	ShadowMouse?: IShadowMouseConfig
}

export interface IImageProcParam {
	name: string,
	defaultValue: number,
	min: number,
	max: number
}

export const toolsConfig = 'toolsConfig';



