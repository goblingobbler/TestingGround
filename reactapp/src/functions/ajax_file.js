import $ from 'jquery';

function ajax_wrapper_file(type, url, data, returnFunc) {
    if (type === 'POST') {
        data.append(
            'csrfmiddlewaretoken',
            window.secret_react_state.csrfmiddlewaretoken,
        );
    }

    $.ajax({
        type,
        url,
        data,

        dataType: 'json',
        processData: false,
        contentType: false,

        success(value) {
            returnFunc(value);
        },
        error(xhr, _status, _error) {
            console.log(xhr.responseText);
        },
    });
}

export default ajax_wrapper_file;
