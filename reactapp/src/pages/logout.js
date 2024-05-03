const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_time');

    window.location.href = '/login';

    return null;
};

export default logout;
