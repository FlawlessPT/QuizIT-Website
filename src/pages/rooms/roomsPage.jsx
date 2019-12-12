import React, { useEffect, useState, Fragment } from 'react';
import { ROOM_PAGE } from '../../constant/pages';
import { createRoomRequest, joinRoomRequest, getRoomsRequest, getTopScoreRequest } from '../../network/quizitAPI';
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
import withMemo from '../../util/withMemo';

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

// Prevent wasteful re-renderings
const RoomListMemoized = withMemo(RoomsList, ['rooms']);

export default function RoomsPage({ state, setState }) {

    const clicked = (id) => {
        // When a room is clicked
        joinRoomRequest(id);
    }

    useEffect(() => {
        // Called when component is mouting
        // Request the server of the available rooms to join
        getRoomsRequest();
        getTopScoreRequest();

        // Listener for the server response of the get rooms request
        document.addEventListener(GET_ROOMS, (data) => {
            setState({
                ...state,
                rooms: data.detail
            })
        });

        // Listener for new created rooms
        document.addEventListener(NEW_ROOM, (data) => {
            state.rooms.push(data.detail);
            setState({
                ...state,
                rooms: state.rooms
            })
        });

        // Listener for your created room
        document.addEventListener(ROOM_CREATED, (data) => {
            setState({
                ...state,
                room: data.detail,
                currentPage: ROOM_PAGE
            })
        });

        // Listener for when you joined the room
        document.addEventListener(ROOM_JOINED, (data) => {
            setState({
                ...state,
                room: data.detail,
                currentPage: ROOM_PAGE
            });
        })

        // returned function will be called on component unmount 
        return () => {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(GET_ROOMS, () => { });
            document.removeEventListener(NEW_ROOM, () => { });
            document.removeEventListener(ROOM_CREATED, () => { });
            document.removeEventListener(ROOM_JOINED, () => { });
        }
    }, [])

    return (
        <div className="all-container">
            <AppBar className="header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Chose a room
                </Typography>
            </AppBar>

            <Paper className="rooms-page page">
                <CreateRoomForm />
                <Divider />
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Available Rooms:
                </Typography>
                <RoomsList rooms={state.rooms} clicked={clicked} />
                {/* <RoomListMemoized rooms={state.rooms} clicked={clicked} /> */}
            </Paper>
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