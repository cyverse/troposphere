import cyverseTheme from 'cyverse-ui/styles/cyverseTheme.js';
import theme from './theme.json';
import _ from 'lodash';

const appTheme = _.merge(cyverseTheme, theme);

export default appTheme
