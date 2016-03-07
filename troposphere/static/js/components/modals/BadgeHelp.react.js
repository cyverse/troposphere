define(
  [
    'react',
    'components/mixins/BootstrapModalMixin.react',
    'stores',
    'globals',
    'actions/BadgeActions'
  ],
  function (React, BootstrapModalMixin, stores, globals, BadgeActions) {

    function getState() {
      return {
        badge: null
      }
    }

    return React.createClass({
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

      render: function () {
        var content = (
          <div>
            <p>Your backpack is your global display of all Mozilla OpenBadges you've earned across the web.</p>
            <p>You can choose to add your Atmosphere badges to your backpack to display them on social networks</p>
            <p>Visit http://openbadges.org/ for more information</p>
          </div>
        );

        return (
          <div className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content badge-modal-content">
                <div className="modal-header">
                  {this.renderCloseButton()}
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

  });
