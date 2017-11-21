import _ from "underscore";
import React from "react";

export default React.createClass({
    displayName: "CustomCommand",

    handleSelect: function(e) {
        e.preventDefault();
        this.props.onChange(document.getElementById("custom_form").elements[0].value);
    },

    render: function() {
        return (
          <div>
              <form onSubmit={this.handleSelect} id="custom_form">
                  <label>
                      Custom Command:
                      <input placeholder={this.props.value} type="text"/>
                      <button type="submit">Save</button>
                  </label>
              </form>
          </div>
        );
    }
});
