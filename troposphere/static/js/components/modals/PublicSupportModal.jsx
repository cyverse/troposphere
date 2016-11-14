import React from "react";
import BootstrapModalMixin from "components/mixins/BootstrapModalMixin";
import globals from "globals";


export default React.createClass({
    displayName: "PublicSupportModal",

    mixins: [BootstrapModalMixin],

    cancel: function() {
        this.hide();
    },

    confirm: function() {
        this.hide();
    },

    render: function() {
        var buttons = (
        <button key={'Okay'}
            type="button"
            className={'btn btn-primary'}
            onClick={this.confirm}>
            {'Okay'}
        </button>
        );

        var content = (
        <div>
            <h4 className="t-body-2">Want to provide feedback?</h4>
            <p>
                {'To avoid automated or auto-generated message, user must be authenticated to give feedback.'}
            </p>
            <h4 className="t-body-2">{'Having trouble logging in?'}</h4>
            <p>
                {`If you are experiencing issues accessing ${globals.SITE_FOOTER}, please contact
              the support staff by sending an email to: `}
                <a href={`mailto${globals.SUPPORT_EMAIL}`}>
                    {`${globals.SUPPORT_EMAIL}`}
                </a>
            </p>
        </div>
        );

        return (
        <div className="modal fade">
            <div className="modal-dialog">
                <div className="modal-content badge-modal-content">
                    <div className="modal-header">
                        {this.renderCloseButton()}
                        <h1 className="t-title">Feedback & Support</h1>
                    </div>
                    <div className="modal-body">
                        {content}
                    </div>
                    <div className="modal-footer">
                        {buttons}
                    </div>
                </div>
            </div>
        </div>
        );
    }

})
