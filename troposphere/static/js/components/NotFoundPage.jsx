import React from "react";
import { hasLoggedInUser } from 'utilities/profilePredicate';
import { capitalize } from 'utilities/str';

import Glyphicon from "components/common/Glyphicon";
import stores from "stores";


export default React.createClass({
    displayName: "NotFoundPage",

    render: function() {
        const { resource = "page" } = this.props;
        const window_location = window.location.pathname;
        const profile = stores.ProfileStore.get();
        const isLoggedIn = hasLoggedInUser(profile);

        return (
        <div style={{ paddingTop: "50px" }} className="container">
            <h1 className="t-display-1">
                {`${capitalize(resource)} Unavailable`}
            </h1>
            <div>
                <p style={{ fontSize: "20px" }}>
                    <Glyphicon name="info-sign" />
                    {` The requested ${resource} cannot be viewed because
                    it either does not exist or you do not currently
                    have permission to view it.`}
                </p>
                {
                    isLoggedIn ?  null : (
                        <p style={{ fontSize: "20px" }}>
                            {`This ${resource} may be visible if you `}
                            <a href={"/login?redirect_to=" + window_location}>log in</a>
                            {`.`}
                        </p>
                    )
                }
            </div>
        </div>
        );
    }

})
