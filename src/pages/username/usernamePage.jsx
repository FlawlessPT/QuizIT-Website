import React, { useEffect } from 'react';
import { USER_CREATED } from '../../constant/messageTypes';
import './username.css';
import { ROOMS_PAGE } from '../../constant/pages';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import logo from "../../images/logo.png";
import CreateUserForm from './components/createUserForm';
import { useHistory } from "react-router-dom";
import { useState } from 'react';
import { handleReplacePageAnimated } from "../../App";

export default function UsernamePage({ state, setState }) {
    const history = useHistory();

    const [exitAnimation, setExitAnimation] = useState(false);

    function handleUserCreated(data) {
        setState({
            ...state,
            id: data.detail.id,
            username: data.detail.name,
            currentPage: ROOMS_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/rooms');
    }
    // animated infinite bounce
    useEffect(() => {
        // Called when component is mouting
        // Listen to when the user is created and update app state
        document.addEventListener(USER_CREATED, handleUserCreated);

        // returned function will be called on component unmount 
        return () => {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(USER_CREATED, handleUserCreated)
        }
    }, [])

    let classes = "username-page page animated ";

    if (exitAnimation) {
        classes += 'zoomOut fast'
    } else {
        classes += 'zoomIn'
    }

    return (
        <div className={classes}>
            <img className="logo" src={logo} />
            <Paper className="container">
                <div className="title-container">
                    <Typography variant="h4" component="h3">
                        Escolhe um nome:
                    </Typography>
                </div>
                <CreateUserForm />
            </Paper>
        </div>

    );
}