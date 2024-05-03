import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    ajax_wrapper,
    get_children,
    apply_props_to_children,
    is_valid_react_child,
} from 'functions';

import { Alert, Button } from 'library';

/**
 * Renders a form
 * @example <Form>
        {children}
    </Form>
 * 
 * @augments {Component<Props,State>}
 */
class Form extends Component {
    static propTypes = {
        /** Dictionary of values to populate form state with on first render */
        defaults: PropTypes.object,

        /** Flag to enforce re-rendering when some defaults are themselves objects. POORLY NAMED!! */
        uses_global_dict: PropTypes.bool,

        /** Changes to form state will be published to a value in global state */
        auto_set_global_state: PropTypes.bool,
        /** Name to publish form state to in global state */
        global_state_name: PropTypes.string,
        /** Custom function to override standard set_global_state */
        set_global_state: PropTypes.func,

        /** Form will provide its entire state on updates rather than specific value */
        full_state: PropTypes.bool,

        /** Custom function that takes control of form submission */
        submit: PropTypes.func,
        /** URL for form to submit to */
        submit_url: PropTypes.string,

        /** Function that will run after form has submitted successfully.  Passes returned data  */
        redirect: PropTypes.func,
        /** URL to redirect user after submission */
        redirect_url: PropTypes.string,

        /** Function that will run after form has submitted successfully.  Does NOT pass any data */
        refresh_data: PropTypes.func,
        /** Flag to reset form to original values after submission */
        reset_state_on_submit: PropTypes.bool,
        /** Function that will run after form has failed to submit */
        submit_failure: PropTypes.func,

        /** URL for deactivating specific object.  Will render delete button */
        delete_url: PropTypes.string,

        /** Form will submit if enter is hit on keyboard */
        submit_on_enter: PropTypes.bool,

        /** Custom class for form wrapper */
        className: PropTypes.string,
        /** Boolean to flag if form wrapper should render as a Bootstrap row */
        row: PropTypes.bool,
        /** Custom button type. Uses Bootstrap classes */
        submit_button_type: PropTypes.string,
        /** Custom class for submit button */
        submit_className: PropTypes.string,
        /** Custom text for submit button.  Default is 'Submit' */
        submit_text: PropTypes.string,
        /** Custom style to be applied to form wrapper */
        style: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            form_child_update_key: null,
            required: [],

            defaults: {},

            form_is_saving_right_now: false,
        };

        this.get_form_defaults = this.get_form_defaults.bind(this);
        this.set_global_state = this.set_global_state.bind(this);
        this.handle_change = this.handle_change.bind(this);
        this.set_form_state = this.set_form_state.bind(this);
        this.reset_state_on_submit = this.reset_state_on_submit.bind(this);
        this.form_submit = this.form_submit.bind(this);
        this.form_submit_callback = this.form_submit_callback.bind(this);
        this.form_submit_failure = this.form_submit_failure.bind(this);
        this.reload = this.reload.bind(this);
        this.check_required_children = this.check_required_children.bind(this);
        this.form_delete = this.form_delete.bind(this);
        this.handle_key_press = this.handle_key_press.bind(this);
    }

    componentDidMount() {
        const defaults = this.get_form_defaults();
        this.setState(defaults, this.set_global_state);
    }

    componentDidUpdate() {
        if (!this.props.uses_global_dict) {
            return null;
        }

        let changed = false;

        Object.keys(this.props.defaults).forEach((key) => {
            if (!(key in this.state)) {
                changed = true;
                return;
            }

            if (typeof this.props.defaults[key] === 'object') {
                if (
                    JSON.stringify(this.state[key]) !=
                    JSON.stringify(this.props.defaults[key])
                ) {
                    changed = true;
                }
            } else if (this.state[key] != this.props.defaults[key]) {
                changed = true;
            }
        });

        if (changed) {
            this.setState(this.get_form_defaults());
        }
    }

    get_form_defaults(clean) {
        let defaults = JSON.parse(JSON.stringify(this.props.defaults || {}));
        const children = get_children(this.props);

        Object.keys(children).forEach((index) => {
            const child = children[index];
            if (child) {
                if (child.props && 'default' in child.props) {
                    defaults[child.props.name] = child.props.default;
                } else if (clean) {
                    defaults[child.props.name] = undefined;
                }
            }
        });

        if (!('required' in defaults)) {
            defaults.required = '';
        }

        return defaults;
    }

    set_global_state(state) {
        if (typeof state === 'undefined') {
            state = this.state;
        }

        if (
            this.props.auto_set_global_state === true ||
            this.props.auto_set_global_state === 'true'
        ) {
            if (this.props.set_global_state) {
                const copied_state = { ...state };
                delete copied_state.form_child_update_key;
                delete copied_state.required;

                this.props.set_global_state(
                    this.props.global_state_name,
                    copied_state,
                );
            }

            // window.secret_react_state.set_global_state(this.props.global_state_name, state);
        }
    }

    handle_change(e) {
        const newState = {};
        let newCompletedState;

        const name = e.target.getAttribute('name');
        newState[name] = e.target.value;

        if (this.props.full_state) {
            newCompletedState = this.state;
            newCompletedState[name] = e.target.value;
        } else {
            newCompletedState = newState;
        }

        this.setState(newState, this.set_global_state(newCompletedState));
    }

    set_form_state(state) {
        let newState;
        if (this.props.full_state) {
            newState = this.state;
        } else {
            newState = {};
        }

        Object.keys(state).forEach((index) => {
            newState[index] = state[index];
        });

        this.setState(state);
        this.set_global_state(newState);
    }

    reset_state_on_submit() {
        const defaults = this.get_form_defaults(true);
        defaults.form_is_saving_right_now = false;

        // Reset key values for all children in order to fully clear states and rerender
        const date = Date.now();
        defaults.form_child_update_key = date;

        this.setState(defaults);
    }

    form_submit() {
        const data = { ...this.state };
        delete data.children;
        delete data.form_state;

        const new_state = {
            required: [],
        };

        const children = get_children(this.props);
        const required = this.check_required_children([], children);

        if (required.length > 0) {
            new_state['required'] = required;
            this.setState(new_state);
        } else {
            new_state['form_is_saving_right_now'] = true;
            this.setState(new_state);

            for (var item in data) {
                if (item.endsWith('[]')) {
                    data[item] = JSON.stringify(data[item]);
                }
            }

            if (this.props.submit) {
                this.props.submit(
                    data,
                    this.form_submit_callback,
                    this.form_submit_failure,
                );

                new_state.form_is_saving_right_now = true;
            } else if (this.props.submit_url) {
                ajax_wrapper(
                    'POST',
                    this.props.submit_url,
                    data,
                    this.form_submit_callback,
                    this.form_submit_failure,
                );
            }
        }
    }

    form_submit_callback(value) {
        if (this.props.redirect) {
            value.form_state = this.state;
            this.props.redirect(value);
        } else if (this.props.refresh_data) {
            this.props.refresh_data();
        }

        if (this.props.reset_state_on_submit) {
            this.reset_state_on_submit();
        } else {
            this.setState({ form_is_saving_right_now: false });
        }
    }

    form_submit_failure(value) {
        if (this.props.submit_failure) {
            this.props.submit_failure(value);
        }
        this.setState({ form_is_saving_right_now: false });
    }

    reload() {
        this.window.location.reload();
    }

    check_required_children(required, context) {
        Object.keys(context).forEach((index) => {
            const child = context[index];
            if (is_valid_react_child(child)) {
                const { props } = child;

                if (props.required === true) {
                    if (
                        !(props.name in this.state) ||
                        this.state[props.name] === undefined ||
                        this.state[props.name] === ''
                    ) {
                        let field_name = props.label;
                        // Fallback behavior in case no label was applied to the input
                        if (!field_name || field_name === '') {
                            field_name = props.name;
                        }

                        required.push(
                            `The field ${field_name} must be filled out to submit the form. `,
                        );
                    }
                }

                let { children } = child.props;
                if (typeof children !== 'undefined') {
                    if (typeof children.length === 'undefined') {
                        children = [child.props.children];
                    }
                    required = this.check_required_children(required, children);
                }
            }
        });

        return required;
    }

    form_delete(event, callback) {
        ajax_wrapper(
            'POST',
            this.props.delete_url,
            {},
            this.form_submit_callback,
            this.form_submit_failure,
        );

        callback();
    }

    handle_key_press(event) {
        if (this.props.submit_on_enter != false) {
            if (event.key === 'Enter') {
                this.form_submit();
            }
        }
    }

    render() {
        let layout = '';
        if (typeof this.props.className !== 'undefined') {
            layout = this.props.className;
        }
        if (this.props.row === true || this.props.row === 'true') {
            layout += ' form-row row';
        } else {
            layout += ' form';
        }

        const newProps = {
            set_form_state: this.set_form_state,
            handle_change: this.handle_change,
            handle_key_press: this.handle_key_press,
            dont_resolve_anything: this.props.dont_resolve_anything,
        };

        let components = [];
        components = apply_props_to_children(this, newProps, this.state, true);

        const new_components = [];
        Object.keys(components).forEach((i) => {
            let component = components[i];
            component = React.cloneElement(component, {
                key: `${this.state.form_child_update_key}_${i}`,
            });
            new_components.push(component);
        });

        components = new_components;

        let buttons = [];
        let float;
        if (this.props.submit_url || this.props.submit) {
            let type = 'primary';
            if (this.props.submit_button_type) {
                type = this.props.submit_button_type;
            }
            float = { float: 'left' };
            let classes = this.props.submit_className;

            let form_protection = {};
            if (this.props.protect_form) {
                form_protection = {
                    deleteType: true,
                    delete_warning_text:
                        this.props.protect_form_text ||
                        'This form is protected, please double check your work.',
                    delete_text: 'Nevermind',
                };
            }

            let submitButton = (
                <Button
                    key={'form_submit_button_key'}
                    style={float}
                    type={type}
                    className={classes}
                    onClick={this.form_submit}
                    {...form_protection}
                >
                    {this.props.submit_text || 'Save'}
                </Button>
            );
            // Anti-mash behavior for form.  This will force users to wait until callback functions have completed
            // and ensure the form is submitted properly
            if (this.state.form_is_saving_right_now) {
                submitButton = (
                    <Button
                        key={'form_submit_button_key'}
                        style={float}
                        type={type}
                        className={`${classes} disabled`}
                        disabled={{ disabled: 'disabled' }}
                    >
                        {this.props.submit_text || 'Save'}
                    </Button>
                );
            } else if (this.state.uploading_from_file_input) {
                submitButton = (
                    <Button
                        key={'form_submit_button_key'}
                        style={float}
                        type={type}
                        className={`${classes} disabled`}
                        disabled={{ disabled: 'disabled' }}
                        text={'Waiting for File Upload...'}
                    >
                        {'Waiting for File Upload...'}
                    </Button>
                );
            }
            buttons.push(submitButton);
        }

        if (this.props.delete_url) {
            float = { float: 'right' };
            const deleteButton = (
                <Button
                    style={float}
                    type="danger"
                    onClick={this.form_delete}
                    deleteType
                    text="Delete"
                />
            );
            buttons.push(deleteButton);
        }

        const failed = [];
        if (this.state.required != []) {
            Object.keys(this.state.required).forEach((i) => {
                failed.push(
                    <Alert type="danger">{this.state.required[i]}</Alert>,
                );
            });
        }

        if (layout.indexOf('row') > -1) {
            buttons = (
                <div className="col-12" style={{ textAlign: 'right' }}>
                    {buttons}
                </div>
            );
        }

        // need to add in form_submit, delete, and handle change functions to components.
        return (
            <div
                className={layout}
                style={this.props.style}
                onKeyPress={this.handle_key_press}
            >
                {components}
                {failed}
                {buttons}
                <div style={{ clear: 'both' }} />
            </div>
        );
    }
}

export default Form;
