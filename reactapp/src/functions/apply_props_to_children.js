import React from 'react';
import { get_children } from 'functions';

function apply_props_to_children(component, parent_functions, form_state) {
    const context = component.props;

    if (
        typeof context['children'] === 'string' ||
        context['children'] instanceof String
    ) {
        return [context['children']];
    }

    const topChildren = get_children(context);
    const components = [];

    const exempt = ['br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    Object.keys(topChildren).forEach((index) => {
        const childComponent = topChildren[index];
        if (!childComponent) {
            return;
        }

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

        let component_exempt = exempt.includes(childComponent.type);

        if (!component_exempt) {
            const component_instance = React.cloneElement(
                childComponent,
                data_mapping,
            );
            components.push(component_instance);
        } else {
            components.push(childComponent);
        }
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
