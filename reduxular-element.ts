import {
    createObjectStore,
    Store,
    ReduxularListener
} from './reduxular';
import {
    Reducer,
    Action
} from 'redux';

/**
 * Nearly the same type as Required<T> BUT allows the property value to be undefined.
 * Example:
 * type example = {
 *     prop?: number;
 * };
 * 
 * INVALID:
 * const thing: Required<example> = {prop: undefined};
 * 
 * VALID:
 * const thing2: RequiredButAllowUndefined<example> = {prop: undefined};
 */
type RequiredButAllowUndefined<T> = {
    [U in keyof Required<T>]: T[U];
};

export class ReduxularElement<State extends Object, A extends Action = any> extends HTMLElement {
    readonly store: Store<State, A>;

    constructor(initialState: RequiredButAllowUndefined<State>, listener: ReduxularListener<State>, reducer?: Reducer<State, A>) {
        super();
        this.store = createObjectStore(initialState, listener, this, reducer);
    }
}