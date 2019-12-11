import React from 'react';
import './wrongChapters.css';
import AppBar from "@material-ui/core/AppBar";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import {RESULT_PAGE, WRONG_QUESTIONS_PAGE} from "../../constant/pages";
import Divider from "@material-ui/core/Divider";

export default function WrongChaptersPage({state, setState}) {

    const goToResult = () => {
        // Go to result page again
        setState({
            ...state,
            currentPage: RESULT_PAGE
        })
    };

    const goToQuestionPage = () => {
        // Go to result page again
        setState({
            ...state,
            currentPage: WRONG_QUESTIONS_PAGE
        })
    };

    return (
        <div className="wrongChapters-page page">
            <AppBar className="wrongChapters-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Capítulos
                </Typography>
            </AppBar>
            <Paper className="wrongChapters-container">
                <Typography style={{ marginTop: 10}} variant="h6">
                    Escolhe o capítulo:
                </Typography>
                <Divider style={{ padding: 1}}/>

                {/* CHAPTERS LIST SAMPLE*/}
                {/* NOTE: ON LOADING A NEW CHAPTER THE GRID-ROW MUST BE CHANGED AS WELL*/}
                <Typography className="chapter1" style={{ marginTop: 10, marginLeft: 15 }} variant="h6">
                    Capítulo: 1
                </Typography>
                <Divider style={{ padding: 1, marginLeft: 15}}/>

                <Button className="wrongChapters-test-btn" variant="contained" color="primary" onClick={goToQuestionPage}>
                    Ver página perguntas p/capítulo (test button, remove later)
                </Button>
                <Button className="wrongChapters-return-btn" variant="contained" color="primary" onClick={goToResult}>
                    Voltar aos resultados
                </Button>
            </Paper>
        </div>
    );
}