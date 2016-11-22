import React from 'react';
import { Title } from 'cyverse-ui';

import Wrapper from 'components/common/ui/Wrapper.react';

export default React.createClass({
    displayName: "ProjectListHeader",

    propTypes: {
        title: React.PropTypes.string.isRequired,
        children: React.PropTypes.element
    },

    render() {
        let styles = this.styles();

        return (
            <Wrapper mb={ 4 }>
                <div style={ styles.wrapper }>
                    <Title 
                        h1
                        display1
                    >
                        {this.props.title}
                    </Title>
                    <div>
                        {this.props.children}
                    </div>
                </div>
            </Wrapper>
        );
    },

    styles() {
        let computedStyles = {};

        computedStyles.wrapper = {
            display: "flex",
            justifyContent: "space-between",
        };

        return computedStyles
    }
});
