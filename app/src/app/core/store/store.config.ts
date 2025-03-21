import { StoreConfig } from '@ngrx/store';
import { AppState } from './reducers/app.reducer';

export const storeConfig: StoreConfig<AppState> = {
  runtimeChecks: {
    strictStateImmutability: true,
    strictActionImmutability: true,
    strictStateSerializability: true,
    strictActionSerializability: true,
  },
  metaReducers: [
    // Add any meta reducers here
    // For example, logging meta reducer
    (reducer) => {
      return (state, action) => {
        const currentState = reducer(state, action);
        console.group(`Action: ${action.type}`);
        console.log('Previous State:', state);
        console.log('Action:', action);
        console.log('Next State:', currentState);
        console.groupEnd();
        return currentState;
      };
    }
  ]
};
