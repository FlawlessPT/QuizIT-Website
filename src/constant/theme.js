import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { deepOrange, lightGreen } from '@material-ui/core/colors';

export const normalTheme = createMuiTheme({
    palette: {
        primary: deepOrange,
    },
});

export const correctTheme = createMuiTheme({
    palette: {
        primary: lightGreen,
    },
});