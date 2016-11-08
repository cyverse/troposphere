import React from 'react';
import Router from 'react-router';
import RouterInstance from 'Router';
import modals from 'modals';
import stores from 'stores';

import { SubHeader } from 'cyverse-ui';
import { DeleteIcon, ReplayIcon } from 'cyverse-ui/icons';

import Wrapper from 'components/common/ui/Wrapper.react';
import DeleteProjectButton from './DeleteProjectButton.react';
import NewResourceButton from './NewResourceButton.react';
import RefreshButton from './RefreshButton.react';

export default React.createClass({
    displayName: 'SecondaryProjectNavigation',

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    mixins: [Router.State],

    onBack() {
        RouterInstance.getInstance()
            .transitionTo("projects");
    },

    render() {
        const project = this.props.project;

        return (
            <Wrapper>
                <SubHeader
                    name={ project.get( 'name' ) }
                    quickOptions={[ 
                        <RefreshButton />, 
                        <DeleteProjectButton project={ project } />,
                        <NewResourceButton project={ project } />,
                    ]}
                    onBack={ this.onBack }
                />
            </Wrapper>
        );
    }
});
