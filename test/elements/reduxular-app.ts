import {
    html,
    render as litRender
} from 'lit-html';
import { 
    createObjectStore
} from '../../reduxular'; 
import './reduxular-test';
import './reduxular-element-test';
import './reduxular-setters-getters-test';
import './reduxular-element-setters-getters-test';
import './reduxular-element-test-optional-property';

type State = {
    readonly count: number;
};

type Action = DOUBLE_INCREMENT;

type DOUBLE_INCREMENT = {
    readonly type: 'DOUBLE_INCREMENT';
}

const InitialState: Readonly<State> = {
    count: 0
};

class ReduxularApp extends HTMLElement {

    readonly store = createObjectStore(
        InitialState,
        (state: Readonly<State>) => litRender(this.render(state), this),
        this,
        (state: Readonly<State>, action: Readonly<Action>) => {
            if (action.type === 'DOUBLE_INCREMENT') {
                return {
                    ...state,
                    count: state.count + 2
                };
            }

            return state;
        }
    );

    render(state: Readonly<State>) {

        console.log('app state', state);

        return html`
            <div>${state.count}</div>
            <button @click=${() => this.store.count += 1}>Increment</button>
            <button @click=${() => this.store.dispatch({
                type: 'DOUBLE_INCREMENT'
            }) }>Double increment</button>

            <reduxular-test .count=${state.count}></reduxular-test>
            <reduxular-element-test .count=${state.count}></reduxular-element-test>
            <reduxular-setters-getters-test .count=${state.count}></reduxular-setters-getters-test>
            <reduxular-element-setters-and-getters-test .count=${state.count}></reduxular-element-setters-and-getters-test>
            <reduxular-element-test-optional-property .optionalCount=${state.count}></reduxular-element-test-optional-property>
        `;
    }
}

window.customElements.define('reduxular-app', ReduxularApp);