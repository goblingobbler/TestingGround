import React, { Component } from 'react';
import { ajax_wrapper_file } from 'functions';

class FileInput extends Component {
    static component_name = 'FileInput';

    constructor(props) {
        super(props);

        this.state = {
            files: null,
            uploaded_files: [],
        };

        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.fileUploadCallback = this.fileUploadCallback.bind(this);
    }

    onChange(e) {
        this.setState(
            { files: e.target.files },
            this.fileUpload(e.target.files),
        );
    }

    fileUpload(files) {
        this.props.set_form_state({ uploading_from_file_input: true });
        let url = '/files/fileUpload/';
        if (this.props.uploadUrl) {
            url = this.props.uploadUrl;
        }

        const formData = new FormData();
        Object.keys(files).forEach((index) => {
            if (index != 'length' && index != 'item') {
                formData.append('files[]', files[index]);
            }
        });
        formData.append('name', this.props.name);
        if (typeof this.props.bucket_name !== 'undefined') {
            formData.append('bucket_name', this.props.bucket_name);
        }
        if (typeof this.props.is_public !== 'undefined') {
            formData.append('is_public', this.props.is_public);
        } else {
            formData.append(
                'is_public',
                !window.secret_react_state.secure_uploads,
            );
        }

        ajax_wrapper_file('POST', url, formData, this.fileUploadCallback);
    }

    fileUploadCallback(value) {
        const newState = { uploading_from_file_input: false };
        newState[this.props.name] = value.uploaded_files[0].url;

        this.props.set_form_state(newState);
    }

    render() {
        let input;
        if (this.props.multiple === true) {
            input = (
                <input
                    onChange={this.onChange}
                    type="file"
                    className="form-control-file"
                    id="exampleFormControlFile1"
                    name={this.props.name}
                    multiple
                />
            );
        } else {
            input = (
                <input
                    onChange={this.onChange}
                    type="file"
                    className="form-control-file"
                    id="exampleFormControlFile1"
                    name={this.props.name}
                />
            );
        }

        let current = null;
        if (this.props.value != '') {
            current = (
                <a href={this.props.value} target="_blank" rel="noreferrer">
                    Currently Uploaded File
                </a>
            );
        }

        return (
            <div className="form-group">
                <label htmlFor="exampleFormControlFile1">
                    {this.props.label}
                </label>
                <br />
                {current}
                {input}
            </div>
        );
    }
}

export default FileInput;
