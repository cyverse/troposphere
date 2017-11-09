import React from "react";
import GuacamoleSelect from "components/settings/web_shell/GuacamoleSelect";
import TerminalEmulator from "components/settings/web_shell/TerminalEmulator";
import actions from "actions";
import modals from "modals";
import stores from "stores";

export default React.createClass({
  displayName: "WebShellSettingsPage",

  getInitialState: function() {
      return {
          showMore: false,
          profile: stores.ProfileStore.get()
      };
  },

  updateState: function() {
      this.setState(this.getInitialState());
  },

  showToggle: function() {
      this.setState({
          showMore: !this.state.showMore
      });
  },

  handleColorSelect: function(colorType) {
      actions.ProfileActions.updateProfileAttributes(this.state.profile, {
          guacamole_color: colorType
      });
  },

  renderMore: function() {
      var selectedGuacamoleColor = this.state.profile.get("settings")["guacamole_color"];
      return (
      <div style={{ marginLeft: "30px" }}>
          <h4>Web Shell Color Select</h4>
          <p>
              Use the form below to select color for SSH terminal in "New Web Shell".
          </p>
          <GuacamoleSelect selected={selectedGuacamoleColor} onSelect={this.handleColorSelect} />
          <TerminalEmulator />
          <button onClick={this.showToggle}>
              Show Less
          </button>
      </div>
      );
  },

  renderLess: function() {
      return <button onClick={this.showToggle}>
                 Show More
             </button>
  },

  render: function() {
      return(
      <div>
          <div>
              <h3 className="t-title">Web Shell Settings</h3>
              {this.state.showMore ?
               this.renderMore() :
               this.renderLess()}
          </div>
      </div>
      );
  }
});
