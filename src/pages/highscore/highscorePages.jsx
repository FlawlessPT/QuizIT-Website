import React, { useEffect, Fragment, useState } from 'react';
import './highscores.css';
import { ROOMS_PAGE } from '../../constant/pages';
import { TOP_SCORE } from '../../constant/messageTypes';
import { getTopScoreRequest } from '../../network/quizitAPI';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { useHistory } from "react-router-dom";
import { handleReplacePageAnimated } from "../../App";

export default function HighScoresPage({ state, setState }) {
    const history = useHistory();
    const [exitAnimation, setExitAnimation] = useState(false);


    const goToRooms = () => {
        // Go to rooms page again
        setState({
            ...state,
            currentPage: ROOMS_PAGE
        });
        // history.replace('/rooms');
        handleReplacePageAnimated(setExitAnimation, history, '/rooms');
    }

    function handleTopScore(data) {
        setState({
            ...state,
            topScores: data.detail
        });
    }

    /**
     * Only runs when this component is created
     */
    useEffect(() => {
        document.addEventListener(TOP_SCORE, handleTopScore);

        getTopScoreRequest();

        return function cleanup() {
            document.removeEventListener(TOP_SCORE, handleTopScore);
        }
    }, [])

    let classes = "high-score-container animated ";

    if (exitAnimation) {
        classes += 'slideOutDown faster';
    } else {
        classes += 'slideInUp faster';
    }

    return (
        <div className="high-score-page page">
            <AppBar className="score-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Highscores
                </Typography>
            </AppBar>
            <Paper className={classes}>
                <Typography style={{ marginTop: 10 }} variant="h6">
                    Highscores:
                </Typography>
                <List>
                    {state.topScores.map((topScore) => <TopScoreItem key={topScore.score / Math.random()} topScore={topScore} />)}
                </List>
                <Button className="score-submit-btn animated slideInUp fast" variant="contained" color="primary" onClick={goToRooms}>
                    Voltar
                </Button>
            </Paper>
        </div>
    );
}

function TopScoreItem(props) {
    const { name, score } = props.topScore;

    return (
        <Fragment>
            <ListItem>
                <ListItemText primary={name} secondary={score} />
            </ListItem>
            <Divider />
        </Fragment>
    );
}