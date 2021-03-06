import React, { useEffect, Fragment, useState } from 'react';
import { ROOM_PAGE, HIGHSCORES_PAGE } from '../../constant/pages';
import { joinRoomRequest, getRoomsRequest } from '../../network/quizitAPI';
import { GET_ROOMS, NEW_ROOM, ROOM_CREATED, ROOM_JOINED } from '../../constant/messageTypes';
import './rooms.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import CreateRoomForm from './components/createRoomForm';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import { useHistory } from "react-router-dom";
import { handleReplacePageAnimated } from "../../App";

let requestRooms = false;

function request() {
    if (!requestRooms) {
        getRoomsRequest();
        requestRooms = true;
        setInterval(() => { requestRooms = true }, 2000);
    }

}

function RoomsList({ rooms, clicked }) {
    return (
        <List component="nav" className="container">
            {rooms.map(room =>
                <RoomItem
                    key={room.id}
                    room={room}
                    clicked={clicked}
                />
            )}
        </List>
    );
}

export default function RoomsPage({ state, setState }) {

    const history = useHistory();
    const [exitAnimation, setExitAnimation] = useState(false);

    const clicked = (id) => {
        // When a room is clicked
        joinRoomRequest(id);
    }

    const goToStopScores = () => {
        setState({
            ...state,
            currentPage: HIGHSCORES_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/scores');
    }

    function handleGetRooms(data) {
        setState({
            ...state,
            rooms: data.detail
        })
    }

    function handleNewRoom(data) {
        state.rooms.push(data.detail);
        setState({
            ...state,
            rooms: state.rooms
        })
    }

    function handleRoomCreated(data) {
        setState({
            ...state,
            room: data.detail,
            currentPage: ROOM_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/room');
    }

    function handleRoomJoined(data) {
        setState({
            ...state,
            room: data.detail,
            currentPage: ROOM_PAGE
        });

        handleReplacePageAnimated(setExitAnimation, history, '/room');
    }

    useEffect(() => {
        // Called when component is mouting
        // Request the server of the available rooms to join
        getRoomsRequest();

        // Listener for the server response of the get rooms request
        document.addEventListener(GET_ROOMS, handleGetRooms);

        // Listener for new created rooms
        document.addEventListener(NEW_ROOM, handleNewRoom);

        // Listener for your created room
        document.addEventListener(ROOM_CREATED, handleRoomCreated);

        // Listener for when you joined the room
        document.addEventListener(ROOM_JOINED, handleRoomJoined)



        // returned function will be called on component unmount 
        return () => {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(GET_ROOMS, handleGetRooms);
            document.removeEventListener(NEW_ROOM, handleNewRoom);
            document.removeEventListener(ROOM_CREATED, handleRoomCreated);
            document.removeEventListener(ROOM_JOINED, handleRoomJoined);
        }
    }, [])

    let classes = "animated ";
    let fabClasses = "top-scores-fab animated ";

    if (exitAnimation) {
        classes += 'slideOutLeft faster'
    } else {
        classes += 'slideInRight faster'
    }

    if (exitAnimation) {
        fabClasses += 'slideOutDown faster';
    } else {
        fabClasses += 'slideInUp faster';
    }

    return (
        <div className="all-container">
            <AppBar className="header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Escolhe uma sala
                </Typography>
            </AppBar>

            <div className={classes}>
                <Paper className="rooms-page page">
                    <CreateRoomForm />
                    <Divider />
                    <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                        Salas disponíveis:
                </Typography>
                    <RoomsList rooms={state.rooms} clicked={clicked} />
                </Paper>
            </div>
            <Fab onClick={goToStopScores} className={fabClasses} color="primary" variant="extended">
                Top Scores
            </Fab>
        </div>
    );
}

function RoomItem(props) {
    const { id, name } = props.room;
    const { clicked } = props;

    return (
        <Fragment>
            <ListItem onClick={() => clicked(id)} button>
                <ListItemText primary={name} />
            </ListItem>
            <Divider />
        </Fragment>
    );
}