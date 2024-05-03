class UserValidator {
    logged_id() {
        if (!window.secret_react_state.user) {
            return false;
        }

        return true;
    }

    is_staff() {
        if (!this.logged_id()) {
            return false;
        }

        let user = window.secret_react_state.user;

        let valid_staff = false;
        if (user.is_staff) {
            valid_staff = true;
        }

        return valid_staff;
    }
}

export default UserValidator;
