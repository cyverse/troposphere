define(function (require) {
    var React = require('react/addons'),
    BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
    modernizrTest = require('components/modals/unsupported/modernizrTest.js'),
    BreakingFeatureList = require('components/modals/unsupported/BreakingFeatureList.react'),
    chrome = require('images/google_chrome_icon.png'),
    firefox = require('images/firefox_icon.png'),
    safari = require('images/safari_icon.png');

    
    return React.createClass({
    
     mixins: [BootstrapModalMixin],
     closeModal: function () {
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
                <button className="btn btn-primary" onClick={this.closeModal} >Try Anyway</button>
                </div>
              </div>
            </div>
          </div>
        );
      }

    });
});
