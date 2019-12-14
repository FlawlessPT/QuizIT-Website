import React, { createContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import { SCORE } from './constant/messageTypes';
import { RESULT_PAGE } from './constant/pages';
import UsernamePage from './pages/username/usernamePage';
import RoomsPage from './pages/rooms/roomsPage';
import RoomPage from './pages/room/roomPage';
import QuestionPage from './pages/question/questionPage';
import ResultPage from './pages/result/resultPage';
import HighScoresPage from './pages/highscore/highscorePages';
import WrongChaptersPage from './pages/wrongChapters/wrongChaptersPage';
import { ThemeProvider } from '@material-ui/core/styles';
import { normalTheme } from './constant/theme';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useHistory
} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


const initialState = {
    username: '',
    room: {},
    questions: [],
    currentPage: 0,
    topScores: []
};

export const AppContext = createContext(initialState);

export function handleReplacePageAnimated(setExitAnimation, history, path) {
    setExitAnimation(true);
    setTimeout(() => history.replace(path), 300);
    // history.replace(path)
}

function App() {
    const history = useHistory();

    const [state, setState] = useState({
        topScores: [],
        currentPage: 0,
        lastGameScore: {
            score: 35.1,
            correct: 5,
            wrong: 5
        },
        username: '',
        id: '',
        room: {
            id: 0,
            name: 'Testing Room',
            participants: [
                {
                    id: 'testingId',
                    name: 'Testing'
                }
            ]
        },
        questions: [],
        currentQuestion: {
            id: 0,
            question: "is A == A?",
            answer: 0,
            options: [
                "A",
                "B",
                "C"
            ]
        },
        rooms: []
    });

    function handleScore(data) {
        setState({
            ...state,
            lastGameScore: data.detail,
            currentPage: RESULT_PAGE
        });
    }

    useEffect(() => {

        history.listen((newLocation, action) => {

            if (newLocation.pathname === '/username') {
                history.replace('/');
            }

            if (newLocation.pathname === '/rooms') {
                return;
            }

            if (action === "PUSH") {
                if (
                    newLocation.pathname !== this.currentPathname ||
                    newLocation.search !== this.currentSearch
                ) {
                    // Save new location
                    this.currentPathname = newLocation.pathname;
                    this.currentSearch = newLocation.search;

                    // Clone location object and push it to history
                    history.push({
                        pathname: newLocation.pathname,
                        search: newLocation.search
                    });
                }
            } else {
                // Send user back if they try to navigate back
                history.go(1);
            }
        });

        // Listen for SCORE message from the server
        // document.addEventListener(SCORE, handleScore);

        return function cleanup() {
            // document.removeEventListener(SCORE, handleScore);
        }
    }, []);

    return (
        <Router getUserConfirmation={(message, callback) => UserConfirmation(message, callback, history, setState, state)} >

            <div className="App">
                <ThemeProvider theme={normalTheme}>
                    <AppContext.Provider value={{ state, setState }}>
                        <AppContext.Consumer>
                            {
                                ({ state, setState }) => (

                                    <Switch>
                                        <Route exact path="/">
                                            <UsernamePage state={state} setState={setState} />
                                        </Route>
                                        <CreatedUserRoute state={state} path="/rooms">
                                            <RoomsPage state={state} setState={setState} />
                                        </CreatedUserRoute>


                                        <HasRoomRoute state={state} path="/room">
                                            <RoomPage state={state} setState={setState} />
                                        </HasRoomRoute>


                                        <HasRoomRoute state={state} path="/questions">
                                            <QuestionPage state={state} setState={setState} />
                                        </HasRoomRoute>

                                        <CreatedUserRoute state={state} path="/result">
                                            <ResultPage state={state} setState={setState} />
                                        </CreatedUserRoute>

                                        <CreatedUserRoute state={state} path="/scores">
                                            <HighScoresPage state={state} setState={setState} />
                                        </CreatedUserRoute>

                                        <CreatedUserRoute state={state} path="/wrong">
                                            <WrongChaptersPage state={state} setState={setState} />
                                        </CreatedUserRoute>
                                        <Redirect to="/" />
                                    </Switch>


                                )
                            }
                        </AppContext.Consumer>
                    </AppContext.Provider>
                </ThemeProvider>
            </div>

        </Router>
    );
}

function CreatedUserRoute({ children, state, ...rest }) {
    return (
        <Route
            {...rest}
            render={({ location }) => state && state.username !== '' ? (
                children
            ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }


        />
    );
}

function HasRoomRoute({ children, state, ...rest }) {
    return (<Route
        {...rest}
        render={({ location }) =>
            state && state.username !== '' && state.room && state.room.id != '' ?
                (children) : (
                    <Redirect
                        to={{
                            pathname: "/result",
                            state: { from: location }
                        }}
                    />

                )
        }
    />
    )
}

const UserConfirmation = (message, callback, history, setState, state) => {
    const container = document.createElement("div");
    container.setAttribute("custom-confirmation-navigation", "");
    document.body.appendChild(container);

    const closeModal = (callbackState) => {
        // history.goBack();
        setState({
            ...state,
            room: {}
        });
        ReactDOM.unmountComponentAtNode(container);
        callback(callbackState);
    };

    ReactDOM.render(
        <Dialog
            open={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Pretende desistir?"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Se sair vai perder esta partida!
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => closeModal(false)} color="primary" autoFocus>
                    cancelar
                </Button>
                <Button onClick={() => closeModal(true)} color="secondary" autoFocus>
                    Sair
                </Button>
            </DialogActions>
        </Dialog>,
        container
    );
};

export default App;
