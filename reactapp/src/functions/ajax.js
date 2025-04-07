import $ from 'jquery';

function handle_error(xhr, status, error) {
    //Error Handler
    console.log('Ajax Failure');
    console.log(xhr.responseText);
    console.log(status);
    console.log(error);
    //Error Handler
}

function clear_tokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    //window.location.href = '/login/';
}

function ajax_wrapper(type, url, data, returnFunc) {
    if (window.location.hostname === 'localhost') {
        url = 'http://localhost:8000' + url;
    }

    if (type === 'POST') {
        data.csrfmiddlewaretoken =
            window.secret_react_state.csrfmiddlewaretoken;
    }

    if (type === 'POST' || type === 'PUT') {
        data = JSON.stringify(data);
    }

    let authToken = '';
    let beforeSend = null;
    if (localStorage.getItem('token')) {
        authToken = `Bearer ${localStorage.getItem('token')}`;
        beforeSend = (request) =>
            request.setRequestHeader('Authorization', authToken);
    }

    $.ajax({
        type,
        url,
        contentType: 'application/json',
        beforeSend,
        data,
        statusCode: {
            200(value) {
                console.log('return!');
                //console.log(value);
                if (typeof value === 'object' && 'redirect' in value) {
                    window.location = `${value.redirect}?redirect=${window.secret_react_state.BASE_URL}`;
                }
                returnFunc(value);
            },
            400(value) {
                value = { error: 'Bad Request' };
                returnFunc(value);
            },
            401(xhr) {
                if (url.endsWith('/user/token/')) {
                    let value = { error: 'Invalid Credentials' };
                    returnFunc(value);
                } else {
                    refreshToken(type, url, data, xhr.responseJSON, returnFunc);
                }
            },
            408(value) {
                value = { error: 'Request Timed Out' };
                returnFunc(value);
            },
        },
    });
}

function refreshToken(type, url, data, responseJSON, returnFunc) {
    if (url.includes('/user/user/') && responseJSON.code === 'user_not_found') {
        clear_tokens();
        return false;
    }

    let refreshData = {};
    refreshData.csrfmiddlewaretoken =
        window.secret_react_state.csrfmiddlewaretoken;

    refreshData.refresh = '';
    if (localStorage.getItem('refresh_token')) {
        refreshData.refresh = localStorage.getItem('refresh_token');
    }

    refreshData = JSON.stringify(refreshData);

    // Revert data to JSON for POST and PUT requests
    if (type === 'POST' || type === 'PUT') {
        data = JSON.parse(data);
    }

    return $.ajax({
        type: 'POST',
        url: '/user/token/refresh/',
        contentType: 'application/json',
        data: refreshData,
        statusCode: {
            401(_xhr) {
                clear_tokens();
            },
            500(_xhr) {
                clear_tokens();
            },
        },
        success(value) {
            localStorage.setItem('token', value.access);
            ajax_wrapper(type, url, data, returnFunc);
        },
        error(xhr, status, error) {
            handle_error(xhr, status, error);
            clear_tokens();
            // window.location.href = window.location.href;
        },
    });
}

export default ajax_wrapper;
