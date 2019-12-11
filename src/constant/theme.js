import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {green, lightBlue, red} from '@material-ui/core/colors';

export const normalTheme = createMuiTheme({
    palette: {
        primary: lightBlue,
    },
});

export const correctTheme = createMuiTheme({
    palette: {
        primary: green,
    },
});

export const wrongTheme = createMuiTheme({
    palette: {
        primary: red,
    },
});