window.secret_react_state = {};

function set_global_state(name, state) {
    if (typeof state === 'object') {
        const newState = window.secret_react_state[name] || {};
        Object.keys(state).forEach((index) => {
            newState[index] = state[index];
        });
        window.secret_react_state[name] = newState;
    } else {
        window.secret_react_state[name] = state;
    }
}

function get_global_state() {
    return window.secret_react_state;
}

window.secret_react_state.set_global_state = set_global_state;
window.secret_react_state.get_global_state = get_global_state;

export default set_global_state;
