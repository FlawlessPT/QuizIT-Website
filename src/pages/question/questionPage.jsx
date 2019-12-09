import React, { useState, useEffect, useRef } from 'react';
import './question.css';
import { NEW_QUESTION, END } from '../../constant/messageTypes';
import { RESULT_PAGE } from '../../constant/pages';
import { sendAnswerRequest } from '../../network/quizitAPI';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import withMemo from '../../util/withMemo';
import { normalTheme, correctTheme } from '../../constant/theme';

function OptionButton({ onClick, disabled, text, theme }) {
    // This disableRipple check is hacky way of knowing through theme if the ripple effect should be enabled or not
    return (
        <ThemeProvider theme={theme}>
            <Button
                disableRipple={theme.palette.primary[50] === '#f1f8e9'}
                variant="contained"
                color="primary"
                disabled={disabled}
                onClick={onClick}><span>{text}</span>
            </Button>
        </ThemeProvider>
    );
};

// Prevents the button from rendering every time the interval ticks
// preventing wasteful renders and saving cpu resources
// Always remember that optimization is king
const OptionButtonMemoized = withMemo(OptionButton, ['disabled', 'text', 'theme']);

export default function QuestionPage({ state, setState }) {

    // let passedTime = 0;
    let intervalReference;

    // Deconstructs the state object
    const { question, options, currentQuestion } = state.currentQuestion;

    // React Hook state for disabling buttons
    const [hasAnswered, setHasAnswered] = useState(false);
    const [chapter, setChapter] = useState(1);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [progress, setProgress] = useState(100);
    const [seconds, setSeconds] = useState(20);
    const [showAnswer, setShowAnswer] = useState(false);

    // Variable reference, it is mutable
    const passedTime = useRef(0);

    /**
     * Send selected answers to the server
     * 
     * @param {Integer} option 
     */
    const answerQuestion = (option) => {

        // While showing the correct option don't allow 
        // the user to send the request to the sever
        if (hasAnswered) {
            return;
        }

        // Disable answers buttons
        setHasAnswered(true)
        // Send answer to the server
        sendAnswerRequest({
            participantId: state.id,
            roomId: state.room.id,
            answer: option
        });
    }

    /**
     * Just externalizing the interval tick for better organization
     */
    const tick = () => {
        passedTime.current += 100;

        setSeconds(Math.trunc(20.0 - (passedTime.current / 1000.0)));
        let percentage = 100 - ((passedTime.current) / (20.0 * 1000.0) * 100.0);

        if (percentage < 0) {
            percentage = 0;
            setHasAnswered(true);
            setProgress(100);
            setShowAnswer(true);

            clearInterval(intervalReference);
        } else {
            setProgress(percentage);
        }
    }

    /**
     * Helper for improving the organization in the UI part
     * @param {Integer} number 
     */
    const getTheme = (number) => {
        return state.currentQuestion && state.currentQuestion.answer === number && showAnswer ? correctTheme : normalTheme;
    }

    /**
     * Helper for improving the organization in the UI part
     * @param {Integer} number 
     */
    const getDisabled = (number) => {
        let disabled = hasAnswered;

        if (hasAnswered) {
            disabled = true;
        }

        if (showAnswer && state.currentQuestion.answer === number) {
            return false;
        }

        return disabled;
    }

    /**
     * This function is called only the component is mouting, doesn't matter
     * how many state updates you do, otherwise there would be multiple event listeners
     */
    useEffect(() => {
        // Start listening for NEW_QUESTION messages from the server
        document.addEventListener(NEW_QUESTION, (data) => {

            // Updates application state
            state.questions.push(data.detail);
            setState({
                ...state,
                questions: state.questions,
                currentQuestion: data.detail
            });

            // Re-enables the answer buttons
            setHasAnswered(false);
            setChapter(data.detail.chapter);
            setShowAnswer(false);
            const number = questionNumber + 1;
            setQuestionNumber(number);

            // Reset timer and interval and set a new one
            passedTime.current = 0;

            if (intervalReference) {
                clearInterval(intervalReference);
            }

            intervalReference = setInterval(tick, 100);
        });

        // returned function will be called on component unmount 
        return function clean() {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(NEW_QUESTION, () => { })
            document.removeEventListener(END, () => { })
            clearInterval(intervalReference);

            setState({
                ...state,
                questions: [],
                currentPage: RESULT_PAGE
            })
        }
    }, [])

    /**
     * This function is called whenever the state from the properties is updated or
     * when the questionNumber is updated
     */
    useEffect(() => {
        // Simply update the question number
        setQuestionNumber(state.questions.length);
    }, [state, questionNumber]);

    return (
        <div style={{ flex: 1 }}>
            <AppBar className="header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Questão: {questionNumber}
                </Typography>
            </AppBar>
            <Paper className="question-page page">
                <Paper className="container question-option-container">

                    <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                        {question}
                    </Typography>
                    <div className="chapter-and-progress-container">
                        <Typography style={{ textAlign: 'left', marginTop: 10, marginLeft: 8 }} variant="h6">
                            Capítulo: {chapter}
                        </Typography>
                        <div className="progress-container">
                            <CircularProgress size={60} variant="static" value={progress} />
                            <span className="left-time">{seconds}</span>
                        </div>
                    </div>

                    <div className="options-container">
                        <OptionButtonMemoized
                            theme={getTheme(0)}
                            text={options ? options[0] : 'A'}
                            onClick={() => answerQuestion(0)}
                            disabled={getDisabled(0)}
                        />
                        <OptionButtonMemoized
                            theme={getTheme(1)}
                            text={options ? options[1] : 'B'}
                            onClick={() => answerQuestion(1)}
                            disabled={getDisabled(1)}
                        />
                        <OptionButtonMemoized
                            theme={getTheme(2)}
                            text={options ? options[2] : 'C'}
                            onClick={() => answerQuestion(2)}
                            disabled={getDisabled(2)}
                        />
                        <OptionButtonMemoized
                            theme={getTheme(3)}
                            text={options ? options[3] : 'D'}
                            onClick={() => answerQuestion(3)}
                            disabled={getDisabled(3)}
                        />

                        {/* This way button will render every 100 miliseconds due to the timer, but with the option above that wont happen */}
                        {/* <ThemeProvider theme={() => getTheme(3)}>
                            <Button onClick={() => answerQuestion(3)} disabled={getDisabled(3)} variant="contained" color="primary">{options ? <span>{options[3]}</span> : <span>D</span>}</Button>
                        </ThemeProvider> */}
                    </div>
                </Paper>
            </Paper>
        </div>
    );
}