import {
  Action,
  ActionCreator,
  ActionReducer,
  ActionType,
  createReducer,
  Creator,
  ReducerTypes,
} from '@ngrx/store';
import { OnReducer } from '@ngrx/store/src/reducer_creator';
//import { LocalStorageService } from './local-storage.service';

export function createRehydrateReducer<S, A extends Action = Action>(
  key: string,
  initialState: S,
  ...ons: ReducerTypes<S, ActionCreator[]>[]
): ActionReducer<S, A> {
  const item = localStorage.getItem(key);
  const newInitialState = (item && JSON.parse(item)) ?? initialState;

  const newOns: ReducerTypes<S, ActionCreator[]>[] = [];
  ons.forEach((oldOn: ReducerTypes<S, ActionCreator[]>) => {
    //const newReducer: ActionReducer<S, A> = (
    const newReducer: OnReducer<
      S,
      ActionCreator<string, Creator<any[], object>>[]
    > = (
      //state: S | undefined,
      state: S,
      action: ActionType<ActionCreator[][number]>,
    ) => {
      const newState = oldOn.reducer(state, action);
      localStorage.setItem(key, JSON.stringify(newState));
      return newState;
    };
    newOns.push({ ...oldOn, reducer: newReducer });
  });
  return createReducer(newInitialState, ...newOns);
}
