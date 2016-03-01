import React from 'react';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import modernizrTest from 'components/modals/unsupported/modernizrTest.js';
import BreakingFeatureList from 'components/modals/unsupported/BreakingFeatureList.react';
import chrome from 'images/google_chrome_icon.png';
import firefox from 'images/firefox_icon.png';
import safari from 'images/safari_icon.png';


export default React.createClass({
    displayName: "UnsupportedModal",

    mixins: [BootstrapModalMixin],

    confirm: function () {
         this.props.closeUnsupportedModal();
         this.hide();
    },

    render: function () {
        var content = (
            <div>
                <h4>This application uses features your browser does not support</h4>
                <p>For the best user experience please update your browser. We recomend using a desktop or laptop with one of the following browsers.</p>
                <div className="browser-list text-center clearfix">
                    <div className="browser col-sm-4">
                        <a href="https://google.com/chrome/browser">
                            <img src={chrome} alt="Chrome Browser" />
                            <p>Chrome</p>
                        </a>
                    </div>
                    <div className="browser col-sm-4">
                        <a href="https://mozilla.org/en-US/firefox/new">
                            <img src={firefox} alt="Firefox Browser" />
                            <p>Firefox</p>
                        </a>
                    </div>
                    <div className="browser col-sm-4">
                        <a href="https://support.apple.com/en_US/downloads/safari">
                            <img src={safari} alt="Safari Browser" />
                            <p>Safari</p>
                        </a>
                    </div>
                </div>
                <hr />
                <h4>Features that may cause problems with your browser</h4>
                <BreakingFeatureList />
            </div>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{this.props.header}</h3>
                </div>
                <div className="modal-body">
                {content}
                </div>
                <div className="modal-footer">
                <button className="btn btn-primary" onClick={this.confirm} >Try Anyway</button>
                </div>
              </div>
            </div>
          </div>
        );

    }
});

