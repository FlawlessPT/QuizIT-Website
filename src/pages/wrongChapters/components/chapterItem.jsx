import React, { Fragment, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

export default function ChapterItem({ chapterData }) {

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <Fragment>
            <ListItem button onClick={handleClick}>
                <ListItemText primary={"Capítulo " + chapterData[0]} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {chapterData[1].map(question => <QuestionItem key={question.id} question={question} />)}
                </List>
            </Collapse>
        </Fragment>
    );
}

function QuestionItem(props) {
    const { question, answer, options } = props.question;

    return (
        <ListItem>
            <ListItemText primary={question} secondary={"Resposta: " + options[answer]} />
        </ListItem>
    );
}