import theme from 'cyverse-ui/styles/cyverseTheme';
import _ from 'lodash';

const { 
    palette: {
        primary1Color,
        accent1Color,
        alternateTextColor,
    }
} = theme;



const THEME = _.merge({},
    theme,
    {
        mainHeader: {
            background: primary1Color,
            border: accent1Color,
            linkColor: alternateTextColor,
        }
    }
);

module.exports = THEME

