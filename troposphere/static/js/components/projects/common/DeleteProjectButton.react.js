import React from 'react';
import modals from 'modals';
import stores from 'stores';
import onDeleteProject from './eventHandlers/onDeleteProject';

import { DeleteIcon } from 'troposphere-ui/icons';

export default React.createClass({
    displayName: "DeleteProjectButton",
    
    proptypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    onDelete(e) {
        e.preventDefault();
        onDeleteProject(this.props.project);
    },

    render() {
        return ( 
            <span onClick={ this.onDelete } >
                <DeleteIcon 
                    size={ 20 }
                />
            </span>
        )
    },
});
