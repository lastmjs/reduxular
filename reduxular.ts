import { 
    createStore,
    combineReducers,
    applyMiddleware,
    bindActionCreators,
    compose,
    Reducer,
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

type Store<T, A extends Action> = {
    - readonly [P in keyof T]: T[P];
} & ReduxStore<T, A>;

export function createObjectStore<T extends Object, A extends Action>(
    initialState: T,
    listener: (state: T) => any,
    object: Object,
    reducer?: Reducer<T, A>
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
        Object.defineProperty(object, key, {
            get () {
                return reduxStore.getState()[key];
            },
            set (val) {
                (reduxStore.dispatch as any)({
                    type: `SET_${key.toString().toUpperCase()}`,
                    value: val
                });    
            }
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
            if (reduxStore[prop]) {
                return reduxStore[prop];
            }
            else {
                return reduxStore.getState()[prop];
            }
        },
        set: (obj, prop, value) => {

            (reduxStore.dispatch as any)({
                type: `SET_${prop.toString().toUpperCase()}`,
                value
            });

            return true;
        }
    });
}

function setterReducer<T, A extends Action>(state: T, action: A): T {

    if (action.type.startsWith('SET_')) {
        const prop = action.type.replace('SET_', '').toLowerCase();
        return {
            ...state,
            [prop]: (action as any).value
        };
    }

    return state;
}