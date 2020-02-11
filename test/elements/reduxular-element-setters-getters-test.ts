import {
    html,
    render as litRender
} from 'lit-html';
import {
    ReduxularElement
} from '../../reduxular-element';

type State = {
    readonly count: number;
};

const initialState: Readonly<State> = {
    count: 0,
};

class ReduxularElementSettersAndGettersTest extends ReduxularElement<State> {

    set count(count: number) {
        console.log('ReduxularElementTest', count);
        this.store.count = count;
    }

    get count() {
        console.log('ff')
        return this.store.getState().count;
    }

    constructor() {
        super(initialState, state => {
            litRender(this.render(state), this);
        });
    }

    render(state: Readonly<State>) {
        console.log('test reduxular element', state, this.store.count);
        console.log('reduxular-element-setters-getters-test get count', this.count);

        return html`
            <div>reduxular-element-setters-getters-test: ${state.count}</div>
        `;
    }
}

window.customElements.define('reduxular-element-setters-and-getters-test', ReduxularElementSettersAndGettersTest);
