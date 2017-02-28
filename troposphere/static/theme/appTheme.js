import cyverseTheme from 'cyverse-ui/styles/cyverseTheme.json';
import theme from './theme.json';
import _ from 'lodash';

const appTheme = _.merge(cyverseTheme, theme);

console.log(appTheme, "app theme")
console.log(cyverseTheme, "cyverse theme")
console.log(theme, "theme")
export default appTheme
