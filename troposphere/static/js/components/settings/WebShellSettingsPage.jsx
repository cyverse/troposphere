import React from "react";
import ColorSchemeSelect from "components/settings/web_shell/ColorSchemeSelect";
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

  handleShellRecordChange: function(event) {
      var isChecked = event.target.checked;
      actions.ProfileActions.updateProfileAttributes(this.state.profile, {
          record_shell: isChecked
      });
  },

  renderMore: function() {
      var selectedGuacamoleColor = this.state.profile.get("settings")["guacamole_color"];
      var recordShell = this.state.profile.get("settings")["record_shell"];

      return (
      <div style={{ marginLeft: "30px" }}>
          <h4 className="t-title">Web Shell Color Select</h4>
          <p>
              Use the form below to select color for SSH terminal in "New Web Shell".
          </p>
          <ColorSchemeSelect selected={selectedGuacamoleColor} onSelect={this.handleColorSelect} />

          <h4 className="t-title">Record Sessions</h4>
          <div>
              <input type="checkbox" checked={recordShell} onChange={this.handleShellRecordChange} /> Record Web Shell sessions.<br/><br/>
          </div>

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
