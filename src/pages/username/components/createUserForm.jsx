import React, { useState } from 'react';
import { createUserRequest } from '../../../network/quizitAPI';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

/**
 * Externalize application logic and also prevent full page re-render
 * @param {*} param0 
 */
export default function CreateUserForm({}) {
    const [username, setUsername] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validate = (usernameInput) => {
        setUsername(usernameInput.trim());

        if (usernameInput.trim().length > 0) {
            setHasError(false);
            setErrorMessage("");
            return true;
        } else {
            setHasError(true);
            setErrorMessage("Username can't be empty!");
            return false;
        }
    }

    const createUser = (event) => {
        if (validate(username)) {
            createUserRequest(username);
        }

        event.preventDefault();
        return false;
    }

    return (
        <div className="form-container">
            <div className="input-container">
                <form onSubmit={event => createUser(event)} noValidate autoComplete="off">
                    <TextField
                        error={hasError}
                        helperText={errorMessage}
                        className="text-input"
                        onChange={text => validate(text.target.value)}
                        label="Username"
                        variant="outlined"
                    />
                </form>
            </div>
            <div className="submit-container">
                <Button
                    className="submit-btn"
                    variant="contained"
                    color="primary"
                    onClick={event => createUser(event)}
                >
                    Start
            </Button>
            </div>
        </div>
    );
}