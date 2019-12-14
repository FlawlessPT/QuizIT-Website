import {
    NEW_USER,
    CREATE_ROOM,
    JOIN_ROOM,
    ANSWER,
    GET_ROOMS,
    START,
    TOP_SCORE,
    DELETE_ROOM,
    LEAVE_ROOM
} from './../constant/messageTypes';

// WebSocket Initialization
let ws = connect();

let isAttempting = true;
const connectIntervalTime = 1500;
let connectInterval = setInterval(attemptToConnect, connectIntervalTime);

function attemptToConnect() {
    if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        console.log('Attempting to connect...');

        try {
            ws = connect();
        } catch (ex) { }
    }
}

function connect() {
    let ws = new WebSocket("wss://pt-quiz-it.herokuapp.com/websocket/chat");
    // let ws = new WebSocket("ws://localhost:8080/websocket/chat");
    ws.onopen = (event) => webSocketConnectedHandler(event);
    ws.onclose = (event) => webSocketDisconnectedHandler(event);
    ws.onmessage = (event) => webSocketOnMessageHandler(event);

    return ws
}

function webSocketConnectedHandler(event) {
    console.log("Connected");

    if (isAttempting === true) {
        clearInterval(connectInterval);
        isAttempting = false;
    }
}

function webSocketDisconnectedHandler(event) {
    console.log("Disconnected");

    if (isAttempting !== true) {
        connectInterval = setInterval(attemptToConnect, connectIntervalTime);
    }
}

function webSocketOnMessageHandler(event) {
    // console.log("Received message: " + event.data);
    const message = JSON.parse(event.data);

    const customEvent = new CustomEvent(message.type, { detail: message.data });

    if (message.type === "PING") {
        send({ type: 'PONG', data: undefined });
    }

    document.dispatchEvent(customEvent);
}

// Requests
export function startRequest() {
    send({ type: START, data: undefined });
}

export function joinRoomRequest(roomId) {
    send({ type: JOIN_ROOM, data: roomId });
}

export function createRoomRequest(name) {
    send({ type: CREATE_ROOM, data: name });
}

export function sendAnswerRequest(answer) {
    send({ type: ANSWER, data: answer });
}

export function createUserRequest(username) {
    send({ type: NEW_USER, data: username });
}

export function getRoomsRequest() {
    send({ type: GET_ROOMS, data: undefined });
}

export function getTopScoreRequest() {
    send({ type: TOP_SCORE, data: undefined });
}

export function deleteRoomRequest() {
    send({ type: DELETE_ROOM, data: undefined });
}

export function leaveRoomRequest() {
    send({ type: LEAVE_ROOM, data: undefined });
}

function send(message) {
    ws.send(JSON.stringify(message));
}
