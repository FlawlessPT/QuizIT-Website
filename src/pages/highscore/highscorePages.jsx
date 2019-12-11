import React, { useEffect } from 'react';
import './highscores.css';
import { ROOMS_PAGE, USERNAME_PAGE } from '../../constant/pages';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';

export default function HighScoresPage({ state, setState }) {

    const goToUsername = () => {
        // Go to username page again
        setState({
            ...state,
            currentPage: USERNAME_PAGE
        })
    }

    return (
        <div className="result-page page">
            <AppBar className="score-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Highscores
                </Typography>
            </AppBar>
            <Paper className="score-container">
                <Typography style={{ marginTop: 10}} variant="h6">
                    Highscores: 
                </Typography>
                {/* <List className="highscores-list">
                    {participants.map(participant => participant ? <ParticipantItem key={participant.id} participant={participant} /> : undefined)}
                </List> */}
                <Button className="score-submit-btn" variant="contained" color="primary" onClick={goToUsername}>
                        Voltar
                </Button>
            </Paper>
        </div>
    );
}