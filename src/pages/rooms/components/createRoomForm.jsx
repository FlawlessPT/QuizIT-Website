import React, { useState } from 'react';
import { createRoomRequest } from '../../../network/quizitAPI';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function CreateRoomForm({ }) {
    const [roomName, setRoomName] = useState('');
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validate = (nameInput) => {
        setRoomName(nameInput.trim());

        if (nameInput.trim().length > 0) {
            setErrorMessage('');
            setHasError(false);
            return true;
        } else {
            setHasError(true);
            setErrorMessage("O nome da sala não pode estar vazio.");
            return false;
        }
    }

    const createRoom = (event) => {
        if (validate(roomName)) {
            createRoomRequest(roomName);
        }

        event.preventDefault();
        return false;
    }

    return (
        <div className="create-room-container">
            <form onSubmit={event => createRoom(event)} noValidate autoComplete="off">
                <TextField
                    error={hasError}
                    helperText={errorMessage}
                    onChange={input => validate(input.target.value)}
                    className="text-input"
                    label="Nome da sala"
                    variant="outlined"
                />
            </form>
            <Button className="submit-btn" variant="contained" color="primary" onClick={event => createRoom(event)}>
                Criar
            </Button>
        </div>
    );
}