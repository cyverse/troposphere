import React from 'react';
import Backbone from 'backbone';
import RouterInstance from 'Router';
import modals from 'modals';
import stores from 'stores';
import moment from "moment";

import { Avatar, SubHeader, Title, Div } from 'cyverse-ui';
import { DeleteIcon, ReplayIcon } from 'cyverse-ui/icons';

import Wrapper from 'components/common/ui/Wrapper';
import DeleteProjectButton from './DeleteProjectButton';
import NewResourceButton from './NewResourceButton';
import RefreshButton from './RefreshButton';

export default React.createClass({
    displayName: 'ProjectResourcesHeader',

    propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onBack() {
        RouterInstance.getInstance()
            .transitionTo("projects");
    },

    render() {
        const { project } = this.props;
        let projectName = project.get('name');
        let projectCreationDate = moment(project.get('start_date')).format("MMM D, YYYY hh:mm a");
        let projectDescription = project.get('description');

        return (
            <Div>
                <Div 
                    mb={5} 
                    style={{ 
                        background: "white",
                        boxShadow: "1px 1px 1px rgba(0,0,0,.3)",
                    }}
                >
                    <Wrapper>
                        <SubHeader
                            name="Project"
                            quickOptions={[ 
                                <RefreshButton />, 
                                <DeleteProjectButton project={ project } />,
                                <NewResourceButton project={ project } />,
                            ]}
                            onBack={ this.onBack }
                        />
                    </Wrapper>    
                </Div>
                <Wrapper>
                    <Div
                        mb={ 4 }
                        style={{ display: "flex"}}
                    >
                        <Div mr={ 3 }>
                            <Avatar 
                                size={ 40 } 
                                name={ projectName } 
                            />
                        </Div>
                        <Div>
                            <Div mb={ 2 }>
                                <Title
                                    h1
                                    headline
                                    mb={ 1 }
                                >
                                    { projectName }
                                </Title>
                                { projectCreationDate }
                            </Div>
                            <p>
                                { projectDescription }
                            </p>
                        </Div>
                    </Div>
                </Wrapper>
            </Div>
        );
    }
});
