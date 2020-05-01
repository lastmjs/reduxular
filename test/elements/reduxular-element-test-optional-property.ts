import {html, render as litRender} from 'lit-html';
import {ReduxularElement} from '../../reduxular-element';

type State = {
    // this works
    optionalCount: number|undefined;
    // this doesn't
    // optionalCount?: number|undefined;
};

const initialState: State = {
    optionalCount: undefined
};

class ReduxularElementTestOptionalProperty extends ReduxularElement<State> {
    constructor() {
        super(initialState, state => {
            litRender(this.render(state), this);
        });
    }

    render(state: Readonly<State>) {
        return html`
            <div>reduxular-element-test-optional-property: ${state.optionalCount}</div>
        `;
    }
}

window.customElements.define('reduxular-element-test-optional-property', ReduxularElementTestOptionalProperty);
