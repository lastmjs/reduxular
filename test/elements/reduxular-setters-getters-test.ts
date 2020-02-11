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

class ReduxularSettersGettersTest extends HTMLElement {

    readonly store = createObjectStore(
        InitialState,
        (state: Readonly<State>) => litRender(this.render(state), this),
        this
    );

    set count(count: number) {
        console.log('set count', count);
        this.store.count = count;
    }

    get count() {
        return this.store.getState().count;
    }

    render(state: Readonly<State>) {
        console.log('this.count', this.count);
        return html`<div>reduxular-setters-and-getters-test: ${state.count}</div>`;
    }
}

window.customElements.define('reduxular-setters-getters-test', ReduxularSettersGettersTest);