import React from "react";
import Backbone from "backbone";
import actions from "actions";
//FIXME: these imports shouldnt _require_ using ../../.. 
import ViewDetails from "../../../projects/detail/details/ViewDetails";
import EditDetails from "../../../projects/detail/details/EditDetails";

export default React.createClass({
    displayName: "IdentityDetailsView",

    propTypes: {
        identity: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function() {
        return {
            isEditing: false
        }
    },

    handleCancel: function() {
        this.setState({
            isEditing: false
        })
    },

    handleSave: function(params) {
        this.setState({
            isEditing: false
        });
        actions.IdentityActions.updateIdentityAttributes(this.props.identity, params)
    },

    handleEdit: function() {
        this.setState({
            isEditing: true
        })
    },

    // ------
    // Render
    // ------

    renderDetailsView: function(identity) {
        return (
        <div className="container">
            <div className="row edit-link-row">
                <a className="edit-link" onClick={this.handleEdit}>Edit details</a>
            </div>
            <ViewDetails identity={identity} />
        </div>
        )
    },

    renderEditDetailsView: function(identity) {
        return (
        <div className="container">
            <EditDetails identity={identity} onSave={this.handleSave} onCancel={this.handleCancel} />
        </div>
        )
    },

    render: function() {
        var identity = this.props.identity,
            view;

        if (this.state.isEditing) {
            view = this.renderEditDetailsView(identity);
        } else {
            view = this.renderDetailsView(identity);
        }

        return view;
    }
});
