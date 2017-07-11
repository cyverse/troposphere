import React from "react";

import IdentityDetailsView from "./detail/details/IdentityDetailsView";

import stores from "stores";


export default React.createClass({
    displayName: "IdentityDetailsPage",

    render() {
        let projectId = Number(this.props.params.projectId),
            project = stores.IdentityStore.get(projectId);

        if (!project) {
            return (
            <div className="loading"></div>
            );
        }

        return (
        <IdentityDetailsView project={project} />
        );
    }

});
