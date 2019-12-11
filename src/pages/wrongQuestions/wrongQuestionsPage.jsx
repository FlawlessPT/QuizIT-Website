import React from 'react';
import './wrongQuestions.css';
import AppBar from "@material-ui/core/AppBar";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import {WRONG_CHAPTERS_PAGE} from "../../constant/pages";
import Divider from "@material-ui/core/Divider";

export default function WrongQuestionsPage({state, setState}) {

    const goToWrongChapters = () => {
        // Go to result page again
        setState({
            ...state,
            currentPage: WRONG_CHAPTERS_PAGE
        })
    };

    return (
        <div className="wrongQuestions-page page">
            <AppBar className="wrongQuestions-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Perguntas
                </Typography>
            </AppBar>
            <Paper className="wrongQuestions-container">
                <Typography style={{ marginTop: 10}} variant="h6">
                    Capítulo: 1 {/* CHOOSED CHAPTER */}
                </Typography>
                <Divider style={{ padding: 1}}/>
                {/* WRONG QUESTIONS LIST SAMPLE*/}
                {/* NOTE: ON LOADING A NEW QUESTION THE GRID-ROW MUST BE CHANGED AS WELL*/}
                <Typography className="chapter1" style={{ marginTop: 10, marginLeft: 15 }} variant="h6">
                    Pergunta: A == A
                </Typography>
                <Typography className="chapter1" style={{ marginLeft: 15 }} variant="h6">
                    Resposta correta: A
                </Typography>
                <Divider style={{ padding: 1, marginLeft: 15}}/>
                <Button className="wrongQuestions-return-btn" variant="contained" color="primary" onClick={goToWrongChapters}>
                    Voltar
                </Button>
            </Paper>
        </div>
    );
}