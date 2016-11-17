import React from "react";
import stores from "stores";
import SelectMenu from "components/common/ui/SelectMenu";
//FIXME: Why not use common/ProjectCreateView.react here?

export default React.createClass({
    displayName: "ProjectCreateStep",

    getInitialState: function() {
        return {
            projectName: "",
            projectDescription: "",
            groupOwner: null,
        };
    },

    isSubmittable: function() {
        var hasName = !!this.state.projectName.trim();
        var hasDescription = !!this.state.projectDescription.trim();
        var hasOwner = !!this.state.groupOwner;
        return hasName && hasDescription && hasOwner;
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
        this.props.onConfirm(this.state.projectName.trim(), this.state.projectDescription.trim(), this.state.groupOwner);
    },

    //
    // Custom Modal Callbacks
    // ----------------------
    //

    // todo: I don't think there's a reason to update state unless
    // there's a risk of the component being re-rendered by the parent.
    // Should probably verify this behavior, but for now, we play it safe.
    onNameChange: function(e) {
        this.setState({
            projectName: e.target.value
        });
    },

    onDescriptionChange: function(e) {
        this.setState({
            projectDescription: e.target.value
        });
    },

    componentDidMount: function() {
        stores.GroupStore.addChangeListener(this.updateState);
    },
    componentWillUnmount: function() {
        stores.GroupStore.removeChangeListener(this.updateState);
    },
    //
    // Render
    // ------
    //

    renderBody: function() {
        let groupList = stores.GroupStore.getAll();
        if(!groupList) {
            return (<div className="loading"></div>);
        }

        return (
        <div role="form">
            <div className="form-group">
                <label htmlFor="project-name">
                    Project Name
                </label>
                <input type="text"
                    className="form-control"
                    value={this.state.projectName}
                    onChange={this.onNameChange} />
            </div>
            <div className="form-group">
                <label htmlFor="project-description">
                    Description
                </label>
                <textarea type="text"
                    className="form-control"
                    rows="7"
                    value={this.state.projectDescription}
                    onChange={this.onDescriptionChange} />
            </div>
            <div className="form-group">
                <label htmlFor="groupOwner">
                    Group Owner
                </label>
                <SelectMenu current={this.state.groupOwner}
                    hintText={"Select a Group Owner"}
                    list={groupList}
                    optionName={g => g.get("name")}
                    onSelect={this.onGroupChange} />
            </div>
        </div>
        );
    },
    onGroupChange: function(group) {
        this.setState({
            groupOwner: group,
        });
    },
    render: function() {

        return (
        <div>
            {this.renderBody()}
            <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={this.props.cancel}>
                    Cancel
                </button>
                <button type="button"
                    className="btn btn-primary"
                    onClick={this.confirm}
                    disabled={!this.isSubmittable()}>
                    Create
                </button>
            </div>
        </div>
        );
    }

});
