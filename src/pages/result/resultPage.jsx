import React from 'react';
import './result.css';
import { ROOMS_PAGE } from '../../constant/pages';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';

export default function ResultPage({ state, setState }) {

    const { score, correct, wrong } = state.lastGameScore;

    const goToRooms = () => {
        // Go to rooms page again
        setState({
            ...state,
            currentPage: ROOMS_PAGE
        })
    }

    return (
        <div className="result-page page">
            <AppBar className="score-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Resultado
                </Typography>
            </AppBar>
            <Paper className="score-container">
                <Typography style={{ marginTop: 10}} variant="h6">
                    O teu score foi: {score}
                </Typography>
                <Typography style={{ marginTop: 10}} variant="h6">
                    Correto: {correct}
                </Typography>
                <Typography style={{ marginTop: 10}} variant="h6">
                    Errado: {wrong}
                </Typography>
                <Button className="score-submit-btn" variant="contained" color="primary" onClick={goToRooms}>
                        Voltar
                </Button>
            </Paper>
        </div>
    );
}