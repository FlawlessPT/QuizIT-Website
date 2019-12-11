import React, { useEffect } from 'react';
import './result.css';
import {ROOMS_PAGE, WRONG_CHAPTERS_PAGE, WRONG_QUESTIONS_PAGE} from '../../constant/pages';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import Divider from "@material-ui/core/Divider";

export default function ResultPage({ state, setState }) {

    const { score, correct, wrong } = state.lastGameScore;

    const goToRooms = () => {
        // Go to rooms page again
        setState({
            ...state,
            currentPage: ROOMS_PAGE
        })
    };

    const goToWrongQuestions = () => {
        // Go to wrong questions page
        setState({
            ...state,
            currentPage: WRONG_CHAPTERS_PAGE
        })
    };

    useEffect(() => {
        if (state.questions.length > 0) {
            setState({
                ...state,
                questions: [],
            })
        }
    }, [state]);

    return (
        <div className="result-page page">
            <AppBar className="score-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Resultado final
                </Typography>
            </AppBar>
            <Paper className="score-container">
                {/*FINAL SCORE*/}
                <Typography style={{ marginTop: 10, marginBottom: 15}} variant="h3">
                    Pontuação final:
                </Typography>
                <Divider style={{ padding: 1}}/>
                <Typography style={{ marginTop: 10, color: "green"}} variant="h5">
                    {score}
                </Typography>

                {/*CORRECT ANSWERS*/}
                <Typography style={{ marginTop: 10, marginBottom: -30}} variant="h4">
                    Respostas corretas:
                </Typography>
                <Divider style={{ padding: 1}}/>
                <Typography style={{ marginTop: 10, color: "gray"}} variant="h6">
                    {correct}
                </Typography>

                {/*WRONG ANSWERS*/}
                <Typography style={{ marginTop: 10, marginBottom: 15}} variant="h4">
                    Respostas erradas:
                </Typography>
                <Divider style={{ padding: 1}}/>
                <Typography style={{ marginTop: 10, color: "gray" }} variant="h6">
                    {wrong}
                </Typography>
                <Button className="wrongChapters-submit-btn" variant="contained" color="primary" onClick={goToWrongQuestions}>
                    Ver perguntas erradas
                </Button>
                <Button className="score-submit-btn" variant="contained" color="primary" onClick={goToRooms}>
                    Voltar a jogar
                </Button>
            </Paper>
        </div>
    );
}