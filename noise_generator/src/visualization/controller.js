import React, { Component } from 'react';


class Controller extends Component {
    constructor(props) {
        super(props);

        this.handle_change = this.handle_change.bind(this);
    }

    componentDidMount() {

    }

    handle_change(event){
        var value = event.currentTarget.value;
        var name = event.currentTarget.name;

        var settings = Object.assign({}, this.props.settings);
        settings[name] = value;

        this.props.update_settings(settings);
    }

    render() {
        var value = this.props.value;

        var style = {
            position: 'absolute',
            top: '0px',
            right: '0px',
            margin: '10px 10px 0px 0px',
            padding: '10px',
            border: 'thin solid #ddd',
            borderRadius: '4px',
            boxShadow: '2px 2px 10px rgb(0 0 0 / 20%)',
        };

        var content = <div style={style}>
            <div>
                <div className="form-group">
                    <label for='size'>Size</label>
                    <input className="form-control" name='size' type='number' max='100' min='1'
                        value={this.props.settings.size} onChange={this.handle_change} />
                </div>
                <div className="form-group">
                    <label for='interval'>Interval</label>
                    <input className="form-control" name='interval' type='number' max='2000' min='200'
                        value={this.props.settings.interval} onChange={this.handle_change} />
                </div>
                <div className="form-group">
                    <label for='type'>Type</label>
                    <select className="form-control" name='type' value={this.props.settings.type} onChange={this.handle_change} >
                        <option value='random'>Random</option>
                    </select>
                </div>
            </div>
        </div>;

        return (
            content
        );
    }
}

export default Controller;
