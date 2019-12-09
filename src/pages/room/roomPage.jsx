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

export default function RoomPage({ state, setState }) {
    const { name, participants, creator } = state.room;

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

    useEffect(() => {
        // Called when component is mouting
        // Listens for USER_LEFT message in order to update the list
        document.addEventListener(USER_LEFT, (data) => {
            const room = state.room;

            for (let i = 0; i < room.participants.length; i++) {
                if (room.participants[i].id === data.detail.id) {
                    room.participants.splice(i, 1);
                }
            }

            setState({
                ...state,
                room: room
            });
        });

        // Just like the other but in this case for joins
        document.addEventListener(USER_JOIN, (data) => {
            const room = state.room;

            room.participants.push(data.detail);

            setState({
                ...state,
                room: room
            });
        });

        // Listen for when the quiz starts
        document.addEventListener(START, (data) => {
            setState({
                ...state,
                currentPage: QUESTION_PAGE
            });
        });

        document.addEventListener(LEAVE_ROOM, (data) => {
            setState({
                ...state,
                currentPage: ROOMS_PAGE,
                room: {}
            });
        });

        document.addEventListener(DELETE_ROOM, (data) => {
            state.rooms = state.rooms.filter(x => x.id !== data.detail.id)
            setState({
                ...state,
                currentPage: ROOMS_PAGE,
                room: {},
                rooms: state.rooms
            });
        });

        return function clean() {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(START, () => { })
            document.removeEventListener(USER_LEFT, () => { })
            document.removeEventListener(USER_JOIN, () => { })
            document.removeEventListener(LEAVE_ROOM, () => { })
            document.removeEventListener(DELETE_ROOM, () => { })
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
                        {participants.map(participant => participant ? <ParticipantItem key={participant.id} participant={participant} /> : undefined)}
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