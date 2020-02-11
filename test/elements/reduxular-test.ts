import {
    html,
    render as litRender
} from 'lit-html';
import { createObjectStore } from '../../reduxular'; 

type State = {
    readonly count: number;
};

const InitialState: Readonly<State> = {
    count: 0
};

class ReduxularTest extends HTMLElement {

    readonly store = createObjectStore(
        InitialState,
        (state: Readonly<State>) => litRender(this.render(state), this),
        this
    );

    render(state: Readonly<State>) {
        console.log('test state', state);

        return html`
            <div>reduxular-test: ${state.count}</div>
        `;
    }
}

window.customElements.define('reduxular-test', ReduxularTest);