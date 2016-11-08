import React from "react";
import Glyphicon from "components/common/Glyphicon";


export default React.createClass({
    displayName: "NotFoundPage",

    render: function() {
        let window_location = window.location.pathname;

        return (
        <div style={{ paddingTop: "50px" }} className="container">
            <h1 className="t-display-1">Page Unavailable</h1>
            <div>
                <p style={{ "fontSize": "133%" }}>
                    <Glyphicon name="info-sign" />
                    {`
                    The requested page cannot be viewed because
                    it either does not exist or you do not currently
                    have permission to view it.
                `}
                </p>
                <p style={{ "fontSize": "133%" }}>
                    {`This page may be visible if you `}
                    <a href={"/login?redirect_to=" + window_location}>log in</a>
                    {`.`}
                </p>
            </div>
        </div>
        );
    }

})
