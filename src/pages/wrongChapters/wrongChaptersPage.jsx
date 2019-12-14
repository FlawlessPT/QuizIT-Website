import React, { useState } from 'react';
import './wrongChapters.css';
import AppBar from "@material-ui/core/AppBar";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import { RESULT_PAGE, WRONG_QUESTIONS_PAGE } from "../../constant/pages";
import Divider from "@material-ui/core/Divider";
import List from '@material-ui/core/List';
import ChapterItem from './components/chapterItem';
import { useHistory } from "react-router-dom";
import { handleReplacePageAnimated } from "../../App";

export default function WrongChaptersPage({ state, setState }) {
    const history = useHistory();
    const [exitAnimation, setExitAnimation] = useState(false);

    const goToResult = () => {
        // Go to result page again
        setState({
            ...state,
            currentPage: RESULT_PAGE
        });
        handleReplacePageAnimated(setExitAnimation, history, '/result');
    };

    let classes = 'animated ';

    if (exitAnimation) {
        classes += 'slideOutLeft faster'
    } else {
        classes += 'slideInLeft faster';
    }

    return (
        <div className="wrongChapters-page page">
            <AppBar className="wrongChapters-header" style={{ height: 56 }} position="static">
                <Typography style={{ marginTop: 10, marginLeft: 8 }} variant="h6">
                    Capítulos
                </Typography>
            </AppBar>
            <div className={classes}>
                <Paper className="wrongChapters-container ">
                    <Typography style={{ marginTop: 10 }} variant="h6">
                        Respostas erradas:
                </Typography>
                    <Divider style={{ marginTop: 10 }} />

                    <List>
                        {state.wrongChapters ? Object.entries(state.wrongChapters).map(chapter => <ChapterItem key={chapter[0]} chapterData={chapter} />) : undefined}
                    </List>
                    <Button className="wrongChapters-return-btn" variant="contained" color="primary" onClick={goToResult}>
                        Voltar aos resultados
                </Button>
                </Paper>
            </div>
        </div>
    );
}