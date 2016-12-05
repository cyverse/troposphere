import React from "react";

import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import globals from "globals";


export default React.createClass({

    mixins: [BootstrapModalMixin],

    getInitialState() {
        let link = globals.USER_PORTAL.link(),
            text = globals.USER_PORTAL.text()

        return {
            link,
            text
        };
    },

    render() {
        let { link, text } = this.state;

        return (
        <div className="modal fade">
            <div className="modal-dialog" style={{ minWidth: "600px"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Expired Password</h1>
                    </div>
                    <div style={{ minHeight: "300px" }} className="modal-body">
                        <p>
                            The cryptographically secure password associated with
                            the cloud providers for your accounts has expired.
                            This will block further actions, like the launching
                            new instances.
                       </p>
                       <p>
                           Please visit <a href={link}>{text}</a> to perform
                           the necessary actions to resolve this problem.
                       </p>
                    </div>
                    <div className="modal-footer">
                        <button type="button"
                                className="btn btn-primary"
                                onClick={this.hide}>
                            Okay
                        </button>
                    </div>
                </div>
            </div>
        </div>
        );
    }
});
