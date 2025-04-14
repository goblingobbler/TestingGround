import React, { Component } from 'react';

const BOOLEANS = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
];

export default class Radios extends Component {
    static component_name = 'Select';

    constructor(props) {
        super(props);

        let options = this.props.options;
        if (this.props.boolean) {
            options = BOOLEANS;
        }

        this.state = { options: options };

        this.ref = React.createRef();
    }

    get_value = () => {
        let { value } = this.props;
        return value;
    };

    handleChange = (e) => {
        const selection = e.target.value;
        const newState = {};

        if (this.props.boolean) {
            // If the select is designated as a boolean, we need to convert the value
            if (selection == 'true') {
                newState[this.props.name] = true;
            } else {
                newState[this.props.name] = false;
            }
        } else {
            newState[this.props.name] = selection;
        }

        this.props.set_form_state(newState);
    };

    render() {
        let layout = '';
        if (this.props.layout) {
            layout = this.props.layout;
        }

        var label = null;
        if (this.props.label) {
            var label = (
                <label style={this.props.label_style}>{this.props.label}</label>
            );
        }

        var value = String(this.get_value());
        if (value == '' || value == 'undefined') {
            value = this.props.defaultoption;
        }

        const optionDict = this.state.options;
        const options = [];

        // Check if default is inside options and add it if not
        let found_default = null;
        let current_default = this.props.defaultoption;
        if (this.props.boolean) {
            if (current_default == 'true') {
                current_default = true;
            } else {
                current_default = false;
            }
        }

        for (var index in optionDict) {
            if (optionDict[index].value === current_default) {
                found_default = optionDict[index];
            }
        }

        const type = ` btn-${this.props.radio_type || 'outline-secondary'}`;
        const button_style = {
            border: 'thin solid',
            ...this.props.button_style,
        };
        // Render Radio Components
        // Create JSX for select options
        for (var index in optionDict) {
            var active = '';
            const current_option = String(optionDict[index].value);

            if (typeof value === 'undefined') {
            } else if (
                this.props.multiple &&
                value.indexOf(current_option) > -1
            ) {
                active = ' active';
            } else if (value == current_option) {
                active = ' active';
            }

            options.push(
                <label className={`btn${active}${type}`} style={button_style}>
                    <input
                        style={{ display: 'none' }}
                        type="radio"
                        name={this.props.name}
                        key={index}
                        value={String(optionDict[index].value)}
                        onClick={this.handleChange}
                    />
                    {optionDict[index].text}
                </label>,
            );
        }

        var select_jsx = <div className="radios">{options}</div>;

        let content = (
            <div
                className={`form-group ${this.props.className}`}
                style={this.props.style}
            >
                {label}
                <div>{select_jsx}</div>
                <div style={{ width: '100%', clear: 'both' }} />
            </div>
        );

        return content;
    }
}
