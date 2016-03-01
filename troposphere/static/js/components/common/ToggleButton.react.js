define(function (require) {

  var React = require('react');

  return React.createClass({
    displayName: "ToggleButton",

    propTypes: {
        //Nothing is required here.
        enabled_text: React.PropTypes.string,
        disabled_text: React.PropTypes.string,
        isEnabled: React.PropTypes.bool,
        onToggle: React.PropTypes.func.isRequired,
    },

    getInitialState: function(){
      return {
          isEnabled: this.props.isEnabled || false,
      };
    },
    getDefaultProps: function () {
      return {
          enabled_text: "True",
          disabled_text: "False"
      };
    },
    renderToggle: function() {
        return (this.state.isEnabled) ? this.renderEnabledToggle() : this.renderDisabledToggle();
    },
    onEnabled: function(e) {
        this.setState({isEnabled: true});
        return this.props.onToggle(true, e);
    },
    onDisabled: function(e) {
        this.setState({isEnabled: false});
        return this.props.onToggle(false, e);
    },
    renderDisabledToggle: function() {
        return (
            <div className="toggle-wrapper" onClick={this.onEnabled}>
              <div className="toggle-switch"></div>
              <div className="toggle-background">
                <div className="toggle-text">{this.props.disabled_text}</div>
              </div>
            </div>
        );
    },
    renderEnabledToggle: function() {
        return (
            <div className="toggle-wrapper" onClick={this.onDisabled}>
              <div className="toggle-background">
                <div className="toggle-text">{this.props.enabled_text}</div>
              </div>
              <div className="toggle-switch"></div>
            </div>
        );
    },
    render: function () {
      // REMOVE this style-hack when we replace this with 'a better switch'
      return (
          <div className="button-toggle" style={{width: "105px"}}>
                {this.renderToggle()}
          </div>
      );
    }
  });

});
