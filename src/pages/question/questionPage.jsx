import React, { useState, useEffect, useRef } from 'react';
import './question.css';
import { NEW_QUESTION, SCORE, WRONG_QUESTIONS } from '../../constant/messageTypes';
import { RESULT_PAGE, QUESTION_PAGE } from '../../constant/pages';
import { sendAnswerRequest } from '../../network/quizitAPI';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import withMemo from '../../util/withMemo';
import { normalTheme, correctTheme } from '../../constant/theme';
import worker_script from './timer.worker.js';
import { useHistory, Prompt } from "react-router-dom";
import { handleReplacePageAnimated } from "../../App";
import TextTransition, { presets } from "react-text-transition";


// Web worker instance
let timerWorker = new Worker(worker_script);

// local varible for the number of questions
let questions = 1;

function OptionButton({ onClick, disabled, text, theme, classes }) {
    const [showAnimation, setShowAnimation] = useState(true);
    const lastText = useRef('');
    const componentIsMounted = useRef(true)

    useEffect(() => {
        componentIsMounted.current = true;

        return () => {
            componentIsMounted.current = false;
        }
    }, []);

    if (lastText.current !== text) {
        lastText.current = text;
        setShowAnimation(true);

    } else if (showAnimation) {
        setTimeout(() => {
            if (componentIsMounted.current) {
                setShowAnimation(false)
            }
        }, 1500);
    }

    // This disableRipple check is hacky way of knowing through theme if the ripple effect should be enabled or not
    return (
        <ThemeProvider theme={theme}>
            <Button
                className={showAnimation ? classes : ''}
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
    const history = useHistory();
    const [exitAnimation, setExitAnimation] = useState(false);


    // Deconstructs the state object
    const { question, options, currentQuestion } = state.currentQuestion;

    // React Hook state for disabling buttons
    const [chapter, setChapter] = useState(1);
    const [questionNumber, setQuestionNumber] = useState(questions);
    const [progress, setProgress] = useState(100);
    const [seconds, setSeconds] = useState(20);
    const [showAnswer, setShowAnswer] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [correctPosition, setCorrectPosition] = useState(0);
    const [selectedOption, setSelectedOption] = useState(-1);

    // Variable reference, it is mutable
    const answered = useRef(false);
    const componentIsMounted = useRef(true)
    const score = useRef(undefined);
    const wrongQuestions = useRef(undefined);

    /**
     * Send selected answers to the server
     * 
     * @param {Integer} option 
     */
    function answerQuestion(option) {

        // While showing the correct option don't allow 
        // the user to send the request to the sever
        if (answered.current) {
            return;
        }

        let answerPosition = 0;
        const selected = shuffledOptions[option];

        for (let i = 0; i < options.length; i++) {
            if (selected === options[i]) {
                answerPosition = i;
                break;
            }
        }

        setSelectedOption(option);

        // Disable answers buttons
        answered.current = true;

        // Send answer to the server
        sendAnswerRequest({
            participantId: state.id,
            roomId: state.room.id,
            answer: answerPosition
        });
    }

    /**
     * Get the correct answers but mapped in the shuffled options
     */
    function getCorrectShuffledPosition(shuffledOptions) {
        const correct = options[state.currentQuestion.answer];

        for (let i = 0; i < shuffledOptions.length; i++) {
            if (correct === shuffledOptions[i]) {
                return i;
            }
        }

        return 0;
    }

    /**
     * Just externalizing the interval tick for better organization
     */
    const tick = (seconds, percentage) => {
        if (percentage <= 0) {
            answered.current = true;
            setProgress(100);
            setShowAnswer(true);

            timerWorker.postMessage('STOP');
        } else {
            setProgress(percentage);
        }

        setSeconds(seconds);
    }

    /**
     * Helper for improving the organization in the UI part
     * @param {Integer} number 
     */
    const getTheme = (number) => {
        return number === correctPosition && showAnswer ? correctTheme : normalTheme;
    }

    /**
     * Helper for improving the organization in the UI part
     * @param {Integer} number 
     */
    const getDisabled = (number) => {
        let disabled = answered.current;

        if (answered.current) {
            disabled = true;
        }

        if (showAnswer && correctPosition === number) {
            return false;
        }

        if (number === selectedOption) {
            return false;
        }

        return disabled;
    }

    /**
    * This function is called whenever the state from the properties is updated or
    * when the questionNumber is updated
    */
    useEffect(() => {
        // Simply update the question number
        setQuestionNumber(questions);
    }, [state, questionNumber]);

    function handleNewQuestion(data) {
        questions++;
        // Updates application state
        state.questions.push(data.detail);
        
        setState({
            ...state,
            questions: state.questions,
            currentQuestion: data.detail
        });

        // Re-enables the answer buttons
        answered.current = false;
        setChapter(data.detail.chapter);
        setShowAnswer(false);
        const number = questionNumber + 1;
        setQuestionNumber(number);

        timerWorker.postMessage('START');
    }

    /**
     * Fisher-Yates Algorithm shuffle algorithm
     * 
     * @param {array} options 
     */
    function shuffleOptions(options) {
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = options[i]
            options[i] = options[j]
            options[j] = temp
        }
    }

    function handleScore(data) {
        score.current = data.detail;

        if (wrongQuestions.current) {
            setState({
                ...state,
                lastGameScore: data.detail,
                wrongChapters: wrongQuestions.current,
                currentPage: RESULT_PAGE
            });

        }

        timerWorker.postMessage('STOP');
        handleReplacePageAnimated(setExitAnimation, history, '/result');
    }

    function handleWrongQuestions(data) {
        wrongQuestions.current = data.detail;

        if (score.current) {
            setState({
                ...state,
                wrongChapters: data.detail,
                lastGameScore: score.current,
                currentPage: RESULT_PAGE
            });
        }
    }

    /**
     * This function is called only the component is mouting, doesn't matter
     * how many state updates you do, otherwise there would be multiple event listeners
     */
    useEffect(() => {
        // Listens from messages sent by the web worker
        timerWorker.onmessage = (event) => {
            if (event.data.type === 'time') {
                const { percentage, seconds } = event.data.data;
                if (componentIsMounted.current) {
                    tick(seconds, percentage);
                }
            }
        };

        timerWorker.postMessage('START');

        document.addEventListener(SCORE, handleScore);

        // Start listening for NEW_QUESTION messages from the server
        document.addEventListener(NEW_QUESTION, handleNewQuestion);
        document.addEventListener(WRONG_QUESTIONS, handleWrongQuestions);

        // returned function will be called on component unmount 
        return function clean() {
            // Clear event listeners otherwise there will be leaks
            document.removeEventListener(NEW_QUESTION, handleNewQuestion);
            document.removeEventListener(WRONG_QUESTIONS, handleWrongQuestions);
            document.removeEventListener(SCORE, handleScore);
            componentIsMounted.current = false
            wrongQuestions.current = undefined;
            score.current = undefined;

            questions = 1;
            setState({
                ...state,
                questions: [],
            })
        }
    }, [])

    useEffect(() => {
        // TODO: REMOVE THIS LATER
        console.log('CORRECT: ' + options[state.currentQuestion.answer]);
        let clonedOptions = options.concat();
        shuffleOptions(clonedOptions);

        setShuffledOptions(clonedOptions);

        if (clonedOptions) {
            setSelectedOption(-1);
            setCorrectPosition(getCorrectShuffledPosition(clonedOptions));
        }

    }, [state.currentQuestion.options])

    let classes = 'question-page page animated ';

    if (exitAnimation) {
        classes += 'slideOutLeft faster'
    } else {
        classes += 'slideInLeft faster';
    }

    return (
        <div className="question-page container">
            <Prompt
                when={state.currentPage !== RESULT_PAGE}
                message={location => `Se sair vai perder esta`}
            />
            <AppBar className="header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Questão: 
                    <TextTransition
                        inline
                        text={questionNumber}
                        springConfig={presets.wobbly}
                    />
                </Typography>
            </AppBar>
            <div className={classes}>
                <Paper className="container question-option-container">
                    <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                        <TextTransition
                            text={question}
                            springConfig={presets.wobbly}
                        />
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
                            classes="animated pulse fast"
                            theme={getTheme(0)}
                            text={options ? shuffledOptions[0] : 'A'}
                            onClick={() => answerQuestion(0)}
                            disabled={getDisabled(0)}
                        />
                        <OptionButtonMemoized
                            classes="animated delay-300 pulse fast"
                            theme={getTheme(1)}
                            text={options ? shuffledOptions[1] : 'B'}
                            onClick={() => answerQuestion(1)}
                            disabled={getDisabled(1)}
                        />
                        <OptionButtonMemoized
                            classes="animated delay-500 pulse fast"
                            theme={getTheme(2)}
                            text={options ? shuffledOptions[2] : 'C'}
                            onClick={() => answerQuestion(2)}
                            disabled={getDisabled(2)}
                        />
                        <OptionButtonMemoized
                            classes="animated delay-700 pulse fast"
                            theme={getTheme(3)}
                            text={options ? shuffledOptions[3] : 'D'}
                            onClick={() => answerQuestion(3)}
                            disabled={getDisabled(3)}
                        />
                    </div>
                </Paper>
            </div>
        </div>
    );
}