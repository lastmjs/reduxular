import {
    createObjectStore,
    Store,
    ReduxularListener
} from './reduxular';
import {
    Reducer,
    Action
} from 'redux';

export class ReduxularElement<State extends Object, A extends Action = any> extends HTMLElement {
    readonly store: Store<State, A>;

    constructor(initialState: State, listener: ReduxularListener<State>, reducer?: Reducer<State, A>) {
        super();
        this.store = createObjectStore(initialState, listener, this, reducer);
    }
}