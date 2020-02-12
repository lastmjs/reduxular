import { 
    createStore,
    combineReducers,
    applyMiddleware,
    bindActionCreators,
    compose,
    Action,
    Store as ReduxStore
} from 'redux';

export {
    createStore,
    combineReducers,
    applyMiddleware,
    bindActionCreators,
    compose
};

export {
    ReduxularElement
} from './reduxular-element';

const setInternalPrefix: 'set_internal_' = 'set_internal_';
const setExternalPrefix: 'set_external_' = 'set_external_';

export type Store<T, A extends Action> = {
    - readonly [P in keyof T]: T[P];
} & ReduxStore<T, A>;

export type ReduxularListener<T> = (state: T) => any;

type GetterOrSetterAlreadyPresentResult = {
    readonly object: Object;
    readonly alreadySet: boolean;
};

// Required because the default redux Reducer type allows S to be undefined. We do not.
type ReduxularReducer<S, A> = (
    state: S,
    action: A
  ) => S;
  
export function createObjectStore<T extends Object, A extends Action>(
    initialState: T,
    listener: ReduxularListener<T>,
    object: Object,
    reducer?: ReduxularReducer<T, A>
): Store<T, A> {

    const reduxStore = createStore((state: T = initialState, action: A) => {
        if (
            reducer !== null &&
            reducer !== undefined
        ) {
            return setterReducer<T, A>(reducer(state, action), action);
        }
        else {
            return setterReducer<T, A>(state, action);
        }
    });

    Object.keys(initialState).forEach((key) => {

        const getterAlreadyPresentResult: Readonly<GetterOrSetterAlreadyPresentResult> = getGetterOrSetterAlreadyPresent(object, key, 'get');
        const setterAlreadyPresentResult: Readonly<GetterOrSetterAlreadyPresentResult> = getGetterOrSetterAlreadyPresent(object, key, 'set');

        const objectToOverride: Object = getterAlreadyPresentResult.alreadySet === true ? getterAlreadyPresentResult.object : setterAlreadyPresentResult.alreadySet === true ? setterAlreadyPresentResult.object : object;

        Object.defineProperty(objectToOverride, key, {
            ...(getterAlreadyPresentResult.alreadySet === false ? {
                get () {
                    return reduxStore.getState()[key as keyof T];
                }
            }: {}),
            ...(setterAlreadyPresentResult.alreadySet === false ? {
                set (val) {
                    (reduxStore.dispatch as any)({
                        type: `${setExternalPrefix}${key}`,
                        value: val
                    });    
                }
            } : {})
        });
    });

    reduxStore.subscribe(() => {
        listener(reduxStore.getState());
    });

    setTimeout(() => {
        (reduxStore.dispatch as any)({
            type: 'RENDER'
        });
    });

    return new Proxy({
        ...reduxStore,
        ...initialState
    }, {
        get: (obj, prop) => {
            if (reduxStore.hasOwnProperty(prop)) {
                return reduxStore[prop as keyof typeof reduxStore];
            }
            
            const state: Readonly<T> = reduxStore.getState();
            
            if (state.hasOwnProperty(prop)) {
                return state[prop as keyof typeof state];
            }
            
            throw new Error(`Property "${prop.toString()}" not present in store or state.`);
        },
        set: (obj, prop, value) => {

            (reduxStore.dispatch as any)({
                type: `${setInternalPrefix}${prop.toString()}`,
                value
            });

            return true;
        }
    });
}

function setterReducer<T, A extends Action>(state: T, action: A): T {

    if (
        action.type.startsWith(setInternalPrefix) ||
        action.type.startsWith(setExternalPrefix)
    ) {
        const prop = action.type.replace(setInternalPrefix, '').replace(setExternalPrefix, '');
        return {
            ...state,
            [prop]: (action as any).value
        };
    }

    return state;
}

function getGetterOrSetterAlreadyPresent(
    object: Object, 
    key: string, 
    getOrSet: 'get' | 'set'
): Readonly<GetterOrSetterAlreadyPresentResult> {

    const ownPropertyDescriptor: Readonly<PropertyDescriptor>|undefined = Object.getOwnPropertyDescriptor(object, key);

    if (
        ownPropertyDescriptor &&
        ownPropertyDescriptor[getOrSet]
    ) {
        return {
            object,
            alreadySet: true
        };
    }
    else {
        const prototype: Object = Object.getPrototypeOf(object);
    
        if (
            prototype === null ||
            prototype === undefined
        ) {
            return {
                object: prototype,
                alreadySet: false
            };
        }
        else {
            return getGetterOrSetterAlreadyPresent(prototype, key, getOrSet);
        }
    }
}