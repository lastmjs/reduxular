import {html, render as litRender} from 'lit-html';
import {ReduxularElement} from '../../reduxular-element';

type State = {
    readonly count: number;
};

const initialState: Readonly<State> = {
    count: 0,
};

class ReduxularElementTest extends ReduxularElement<State> {
    constructor() {
        super(initialState, state => {
            litRender(this.render(state), this);
        });
    }

    render(state: Readonly<State>) {
        console.log('test reduxular element', state, this.store.count);

        return html`
            <div>reduxular-element-test: ${state.count}</div>
        `;
    }
}

window.customElements.define('reduxular-element-test', ReduxularElementTest);
