import React from 'react';
import { get_children } from 'functions';

function apply_props_to_children(component, parent_functions, form_state) {
    const context = component.props;
    const topChildren = get_children(context);
    const components = [];

    Object.keys(topChildren).forEach((index) => {
        const childComponent = topChildren[index];

        let data_mapping = parent_functions;
        if (form_state) {
            data_mapping = get_form_props(
                form_state,
                childComponent,
                data_mapping,
                index,
                component.props.autoFocus,
            );
        }
        data_mapping.children = apply_props_to_children(
            childComponent,
            form_state,
        );

        const component_instance = React.cloneElement(
            childComponent,
            data_mapping,
        );
        components.push(component_instance);
    });

    return components;
}

function get_form_props(state, component, data, index, autoFocus) {
    if (component.props) {
        const value = state[component.props.name];

        data.value = value;
        if (index === 0 && autoFocus) {
            data.autoFocus = true;
        }
    }

    return data;
}

export default apply_props_to_children;
