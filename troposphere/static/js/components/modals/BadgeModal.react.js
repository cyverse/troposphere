import React from 'react';
import BootstrapModalMixin from 'components/mixins/BootstrapModalMixin.react';
import stores from 'stores';
import globals from 'globals';
import BadgeActions from 'actions/BadgeActions';


function getState() {
    return {
        badge: null
    }
}

export default React.createClass({
      mixins: [BootstrapModalMixin],

      //
      // Mounting & State
      // ----------------
      //
      getInitialState: function(){
        return getState();
      },

      updateState: function () {
        if (this.isMounted()) this.setState(getState());
      },

      //
      // Internal Modal Callbacks
      // ------------------------
      //

      cancel: function(){
        this.hide();
      },

      confirm: function () {
        this.hide();
        this.props.onConfirm(this.state.badge);
      },

      render: function () {
        var criteria = this.props.badge.get('criteria').map(function(item) {
          return(
            <p>{item.description} </p>
          )
        });

        var content = (
          <div>
            <img className="badge-modal-image" src={this.props.badge.get('imageUrl')} />
            <span className="badge-modal-text">
              <strong>Criteria: </strong>{criteria}
              <p><strong>What does this mean{'?'}</strong></p>
              <p>Text here about how to earn this badge in detail</p>
            </span>
          </div>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content badge-modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
                  <strong>{this.props.badge.get('name')}</strong>
                </div>
                <div className="modal-body">
                  {content}
                </div>
              </div>
            </div>
          </div>
        );
      }
});
