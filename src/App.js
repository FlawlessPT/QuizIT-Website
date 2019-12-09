import React, { createContext, useState, useEffect } from 'react';
import './App.css';
import { SCORE } from './constant/messageTypes';
import { USERNAME_PAGE, ROOMS_PAGE, ROOM_PAGE, RESULT_PAGE, QUESTION_PAGE } from './constant/pages';
import UsernamePage from './pages/username/usernamePage';
import RoomsPage from './pages/rooms/roomsPage';
import RoomPage from './pages/room/roomPage';
import QuestionPage from './pages/question/questionPage';
import ResultPage from './pages/result/resultPage';
import { ThemeProvider } from '@material-ui/core/styles';
import { normalTheme } from './constant/theme';

const initialState = {
  username: '',
  room: {},
  questions: [],
  currentPage: 0
};

export const AppContext = createContext(initialState);

function App() {

  const [state, setState] = useState({
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

  useEffect(() => {
    // Listen for SCORE message from the server
    document.addEventListener(SCORE, (data) => {
      setState({
        ...state,
        lastGameScore: data.detail,
        currentPage: RESULT_PAGE
      });
    });

    return function cleanup() {
      document.removeEventListener(SCORE, () => { })
      // setState({
      //   ...state,
      //   questions: []
      // })
    }
  }, [state]);

  return (
    <div className="App">
      <ThemeProvider theme={normalTheme}>
        <AppContext.Provider value={{ state, setState }}>
          <AppContext.Consumer>
            {
              ({ state, setState }) => (
                <React.Fragment>
                  {state.currentPage === USERNAME_PAGE ?
                    <UsernamePage
                      state={state}
                      setState={setState} />
                    : undefined}

                  {state.currentPage === ROOMS_PAGE ?
                    <RoomsPage
                      state={state}
                      setState={setState} />
                    : undefined}

                  {state.currentPage === ROOM_PAGE ?
                    <RoomPage
                      state={state}
                      setState={setState} />
                    : undefined}

                  {state.currentPage === QUESTION_PAGE ?
                    <QuestionPage
                      state={state}
                      setState={setState} />
                    : undefined}

                  {state.currentPage === RESULT_PAGE ?
                    <ResultPage
                      state={state}
                      setState={setState} />
                    : undefined}
                </React.Fragment>
              )
            }
          </AppContext.Consumer>
        </AppContext.Provider>
      </ThemeProvider>
    </div>
  );
}

export default App;
