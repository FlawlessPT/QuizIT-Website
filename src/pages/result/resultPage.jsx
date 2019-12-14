import React, { useEffect, useState } from 'react';
import './result.css';
import { ROOMS_PAGE, WRONG_CHAPTERS_PAGE, WRONG_QUESTIONS_PAGE } from '../../constant/pages';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Divider from "@material-ui/core/Divider";
import CountUp from 'react-countup';
import { WRONG_QUESTIONS } from '../../constant/messageTypes';
import { useHistory } from "react-router-dom";
import { handleReplacePageAnimated } from "../../App";

export default function ResultPage({ state, setState }) {
    const history = useHistory();
    const [exitAnimation, setExitAnimation] = useState(false);

    const { score, correct, wrong } = state.lastGameScore;

    const goToRooms = () => {
        // Go to rooms page again
        setState({
            ...state,
            currentPage: ROOMS_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/rooms');
    };

    const goToWrongQuestions = () => {
        // Go to wrong questions page
        setState({
            ...state,
            currentPage: WRONG_CHAPTERS_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/wrong');
    };

    function handleWrongQuestions(data) {
        setState({
            ...state,
            wrongChapters: data.detail,
        });
    }

    useEffect(() => {
        document.addEventListener(WRONG_QUESTIONS, handleWrongQuestions);

        return function cleanup() {
            document.removeEventListener(WRONG_QUESTIONS, handleWrongQuestions);
        }

    }, [state]);

    useEffect(() => {
        if (state.questions.length > 0) {
            setState({
                ...state,
                questions: [],
            })
        }
    }, [state]);

    let classes = 'animated ';

    if (exitAnimation) {
        classes += 'slideOutRight faster'
    } else {
        classes += 'slideInRight faster';
    }

    return (
        <div className="result-page page">
            <AppBar className="score-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Resultado final
                </Typography>
            </AppBar>
            <div className={classes}>
                <Paper className="score-container">
                    {/*FINAL SCORE*/}
                    <div className="final-score-container">
                        <Typography variant="h4">
                            Pontuação final:
                    </Typography>
                        <Typography variant="h5">
                            <CountUp end={score} duration={5} />
                        </Typography>
                    </div>

                    <div className="wrong-and-right-numbers-container">
                        <div className="correct-or-wrong-container">
                            {/*CORRECT ANSWERS*/}
                            <Typography variant="h5">
                                Respostas corretas:
                        </Typography>
                            <Typography variant="h6">
                                <CountUp end={correct} duration={5} />
                            </Typography>
                        </div>

                        <div className="correct-or-wrong-container">
                            {/*WRONG ANSWERS*/}
                            <Typography variant="h5">
                                Respostas erradas:
                        </Typography>
                            <Typography variant="h6">
                                <CountUp end={wrong} duration={5} />
                            </Typography>
                        </div>

                    </div>
                    <Divider className="result-page-divider-margin" />

                    <Button className="wrongChapters-submit-btn" variant="contained" color="primary" onClick={goToWrongQuestions}>
                        Ver perguntas erradas
                </Button>
                    <Button className="score-submit-btn" variant="contained" color="primary" onClick={goToRooms}>
                        Voltar a jogar
                </Button>
                </Paper>
            </div>
        </div>
    );
}