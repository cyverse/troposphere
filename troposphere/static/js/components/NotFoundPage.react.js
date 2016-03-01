import React from 'react';
import Glyphicon from 'components/common/Glyphicon.react';


export default React.createClass({
    displayName: "NotFoundPage",

    render: function() {

        return (
        <div className="container">
            <h2>Page Unavailable</h2>
            <div>
                <p style={{'fontSize': '133%'}}>
                <Glyphicon name="info-sign" />
                {`
                    The requested page cannot be viewed because
                    it either does not exist or you do not currently
                    have permission to view it.
                `}
                </p>
                <p style={{'fontSize': '133%'}}>
                {`This page may be visible if you `}
                <a href="/login?redirect=/application?beta=true">log in</a>{`.`}
                </p>
            </div>
        </div>
        );
    }

})
