define(function (require) {

  var React = require('react'),
      BootstrapModalMixin = require('components/mixins/BootstrapModalMixin.react'),
      stores = require('stores'),
      moment = require('moment');

  return React.createClass({
    mixins: [BootstrapModalMixin],

    //
    // Mounting & State
    // ----------------
    //
    getInitialState: function(){
      return this.getState.apply(this);
    },

    getState: function(){
      return {
        version: stores.VersionStore.getVersion()
      };
    },

    updateState: function () {
      if (this.isMounted()) this.setState(this.getState.apply(this));
    },

    componentDidMount: function () {
      stores.VersionStore.addChangeListener(this.updateState);
    },

    componentWillUnmount: function () {
      stores.VersionStore.removeChangeListener(this.updateState);
    },

    //
    // Internal Modal Callbacks
    // ------------------------
    //

    close: function () {
      this.hide();
    },

    //
    // Render
    // ------
    //

    render: function () {
      var buttonArray = [
        {type: 'primary', text: "Close", handler: this.close}
      ];

      var buttons = buttonArray.map(function (button) {
        return (
          <button key={button.text} type="button" className={'btn btn-' + button.type} onClick={button.handler}>
            {button.text}
          </button>
        );
      }.bind(this));

      var content;
      if(this.state.version){
        var client = this.state.version.client;
        var clientVersion = client.get("git_branch") + " " + client.get("git_sha_abbrev");
        var clientLastUpdated = moment(client.get('commit_date')).format("MMM Do YYYY");

        var server = this.state.version.server;
        var serverVersion = server.get("git_branch") + " " + server.get("git_sha_abbrev");
        var serverLastUpdated = moment(server.get('commit_date')).format("MMM Do YYYY");

        content = (
          <div role='form'>

            <div className='form-group'>
              <div>
                <label>Client</label>
                {", " + clientLastUpdated}
                <p>{clientVersion}</p>
              </div>
              <div>
                <label>Server</label>
                {", " + serverLastUpdated}
                <p>{serverVersion}</p>
              </div>
            </div>

          </div>
        );
      }else{
        content = (
          <div className="loading"></div>
        );
      }

      return (
        <div className="modal fade">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                {this.renderCloseButton()}
                <strong>{this.props.header}</strong>
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

  });

});
