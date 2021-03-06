export { IEntryComponent } from './directives/entry-component.directive';
export { AlertMsgTypes } from './alerts/model';

export {
	initialMapState,
	mapFeatureKey,
	MapReducer,
	IMapState,
	mapStateSelector,
	selectActiveMapId,
	selectMapsList,
	selectMapsTotal,
	selectMaps,
	selectLayout,
	selectWasWelcomeNotificationShown,
	selectToastMessage
} from './reducers/map.reducer';

export {
	ImageryCreatedAction,
	ImageryRemovedAction,
	PinLocationModeTriggerAction,
	RemovePendingOverlayAction,
	SetIsLoadingAcion,
	SetIsVisibleAcion,
	SetPendingOverlaysAction,
	SetProgressBarAction,
	UpdateMapSizeAction,
	ClickOutsideMap,
	ContextMenuDisplayAction,
	ContextMenuShowAction,
	ContextMenuTriggerAction,
	ShadowMouseProducer,
	PointToRealNorthAction,
	MapActionTypes,
	SetActiveMapId,
	SetMapsDataActionStore,
	ChangeImageryMap,
	ChangeImageryMapSuccess,
	UpdateMapAction,
	SetMapPositionByRectAction,
	SetMapPositionByRadiusAction,
	SetToastMessageAction,
	PositionChangedAction,
	BackToWorldSuccess,
	BackToWorldView,
	ToggleMapLayersAction,
	SetLayoutAction,
	SetLayoutSuccessAction,
	IPendingOverlay
} from './actions/map.actions';

export {
	ImageryStatusActionTypes,
	ToggleFavoriteAction,
	TogglePresetOverlayAction,
	SetRemovedOverlaysIdAction,
	SetFavoriteOverlaysAction,
	SetPresetOverlaysAction,
	SetRemovedOverlaysIdsAction,
	ResetRemovedOverlaysIdsAction,
	SetRemovedOverlaysVisibilityAction,
	EnableCopyOriginalOverlayDataAction,
	SetRemovedOverlayIdsCount,
	AddAlertMsg,
	RemoveAlertMsg,
} from './actions/imagery-status.actions'

export {
	imageryStatusFeatureKey,
	ImageryStatusReducer,
	imageryStatusStateSelector,
	imageryStatusInitialState,
	selectRemovedOverlaysIdsCount,
	selectFavoriteOverlays,
	selectPresetOverlays,
	selectRemovedOverlays,
	selectRemovedOverlaysVisibility
} from './reducers/imagery-status.reducer'

export { copyFromContent } from './utils/clipboard';
export { getTimeFormat, getTimeDiff, getTimeDiffFormat  } from './utils/time';

export { MapFacadeService } from './services/map-facade.service';
export { IMapFacadeConfig } from './models/map-config.model';
export { mapFacadeConfig } from './models/map-facade.config';
export { AlertsModule } from './alerts/alerts.module';
export { IAlert, IAlertComponent } from './alerts/alerts.model';
export { EntryComponentDirective } from './directives/entry-component.directive';
export { InfiniteScrollDirective } from './directives/infinite-scroll.directive';
export { AnimatedEllipsisComponent } from './components/animated-ellipsis/animated-ellipsis.component';
export { MapFacadeModule } from './map-facade.module';


export { LayoutKey, layoutOptions, IMapsLayout } from './models/maps-layout';
