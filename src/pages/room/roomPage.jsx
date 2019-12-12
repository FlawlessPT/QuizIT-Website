import React, { useEffect, Fragment } from 'react';
import './room.css';
import { USER_JOIN, USER_LEFT, START, LEAVE_ROOM, DELETE_ROOM } from '../../constant/messageTypes';
import { startRequest, deleteRoomRequest, leaveRoomRequest } from '../../network/quizitAPI';
import { QUESTION_PAGE, ROOMS_PAGE } from '../../constant/pages';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function RoomPage({ state, setState }) {
    const { name, participants, creator } = state.room;

    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
        setState({
            ...state,
            currentPage: ROOMS_PAGE
        })
    };

    /**
     * Starts the quiz, this option should only be possible to the room creator
     */
    const startQuiz = () => {
        startRequest();
    }

    /**
     * Deletes the room, this option should only be possible to the room creator
     */
    const deleteRoom = () => {
        deleteRoomRequest();
    }

    /**
     * Leaves the room, this option should not be possible to the room creator
     */
    const leaveRoom = () => {
        leaveRoomRequest();

        // Navigate back to rooms
        setState({
            ...state,
            room: undefined,
            currentPage: ROOMS_PAGE
        })
    };

    function handleDeleteRoom(data) {
        state.rooms = state.rooms.filter(x => x.id !== data.detail);

        const newState = {
            ...state,
            room: {},
            rooms: state.rooms
        };

        if (state.room.id === data.detail && !state.room.creator) {
            setOpen(true);
        } else {
            newState.currentPage = ROOMS_PAGE;
        }

        setState(newState);
    }

    function handleUserJoin(data) {
        const room = state.room;

        room.participants.push(data.detail);

        setState({
            ...state,
            room: room
        });
    }

    function handleUserLeft(data) {
        const room = state.room;
        for (let i = 0; i < room.participants.length; i++) {
            if (room.participants[i].id === data.detail.id) {
                room.participants.splice(i, 1);
                break;
            }
        }

        setState({
            ...state,
            room: room
        });
    }

    function handleLeaveRoom(data) {
        setState({
            ...state,
            currentPage: ROOMS_PAGE,
            room: {}
        });
    }

    function handleStart(data) {
        setState({
            ...state,
            currentPage: QUESTION_PAGE
        });
    }

    useEffect(() => {
        // Called when component is mouting
        // Listens for USER_LEFT message in order to update the list
        document.addEventListener(USER_LEFT, handleUserLeft);

        // Just like the other but in this case for joins
        document.addEventListener(USER_JOIN, handleUserJoin);

        // Listen for when the quiz starts
        document.addEventListener(START, handleStart);

        document.addEventListener(LEAVE_ROOM, handleLeaveRoom);

        document.addEventListener(DELETE_ROOM, handleDeleteRoom);

        return function clean() {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(START, handleStart);
            document.removeEventListener(USER_LEFT, handleUserLeft);
            document.removeEventListener(USER_JOIN, handleUserJoin);
            document.removeEventListener(LEAVE_ROOM, handleLeaveRoom);
            document.removeEventListener(DELETE_ROOM, handleDeleteRoom);
        }
    }, [])

    return (
        <div className="all-container">
            <AppBar className="header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    {name}
                </Typography>
            </AppBar>
            <Paper className="room-page page">
                <div className="room-container">
                    <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                        Jogadores participantes:
                    </Typography>
                    <List className="participants-list">
                        {participants ? participants.map(participant => participant ? <ParticipantItem key={participant.id} participant={participant} /> : undefined) : undefined}
                    </List>
                    <div className="room-options-container">
                        <div className="creater-options">
                            {creator ? <Button className="creator-btn btn" onClick={startQuiz} variant="contained" color="primary">Iniciar</Button> : undefined}
                            {creator ? <Button className="creator-btn btn" onClick={deleteRoom} variant="contained" color="primary">Apagar sala</Button> : undefined}
                        </div>
                        <div className="participant-options">
                            {!creator ? <Button onClick={leaveRoom} variant="contained" color="primary">Sair</Button> : undefined}
                        </div>
                    </div>
                </div>
            </Paper>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Sala apagada!"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        A sala em que estava foi apagada!
          </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Voltar para as salas
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function ParticipantItem(props) {
    const { name } = props.participant;

    return (
        <Fragment>
            <ListItem>
                <ListItemText primary={name} />
            </ListItem>
            <Divider />
        </Fragment>
    );
}