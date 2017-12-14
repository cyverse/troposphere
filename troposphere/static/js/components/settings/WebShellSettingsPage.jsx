import React from "react";
import ColorSchemeSelect from "components/settings/web_shell/ColorSchemeSelect";
import LoginCommandSelect from "components/settings/web_shell/LoginCommandSelect";
import CustomCommandEntry from "components/settings/web_shell/CustomCommandEntry";
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

  handleTermEmulatorSelect: function(term) {
      actions.ProfileActions.updateProfileAttributes(this.state.profile, {
          term_emulator: term
      });
  },

  renderMore: function() {
      var selectedGuacamoleColor = this.state.profile.get("settings")["guacamole_color"];
      var selectedTermEmulator = this.state.profile.get("settings")["term_emulator"];

      var customCommand = <div></div>;
      if (selectedTermEmulator != "Screen" && selectedTermEmulator != "Tmux" && selectedTermEmulator != "Default")
          customCommand = <CustomCommandEntry value={selectedTermEmulator} onChange={this.handleTermEmulatorSelect} />

      return (
      <div style={{ marginLeft: "30px" }}>
          <h4>Color Scheme</h4>
          <p>
          Use the form below to select color for SSH terminal in "New Web Shell".
          </p>
          <ColorSchemeSelect selected={selectedGuacamoleColor} onSelect={this.handleColorSelect} />

          <h4>Web Shell Login</h4>
          <p>
          Customize your Web Shell by selecting a command from the dropdown to run it when initiating a Web Shell connection.<br/>
          Select "Custom" to enter your own command. Please note that if the command is invalid, Web Shell connections may fail.
          </p>
          <LoginCommandSelect selected={selectedTermEmulator} onSelect={this.handleTermEmulatorSelect} />

          {customCommand}

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
