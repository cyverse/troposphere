define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    var PageHeader = React.createClass({
      getInitialState: function () {
        return {showHelpText: false};
      },
      render: function () {
        var help_button = [];
        var help_text = [];
        if (this.props.helpText) {
          help_button = React.DOM.button({
              type: 'button',
              id: 'help-text-toggle-button',
              className: 'btn btn-default',
              onClick: this.showHelpText},
            Glyphicon({name: 'question-sign'}));

          help_text = React.DOM.div({
              id: 'help-text',
              style: {display: this.state.showHelpText ? 'block' : 'none'}},
            React.DOM.div({className: 'well'}, this.props.helpText()));
        }

        return React.DOM.div({className: 'main-page-header'},
          React.DOM.h1({}, this.props.title),
          help_button,
          help_text);
      },
      showHelpText: function () {
        this.setState({showHelpText: !this.state.showHelpText});
      }
    });

    return PageHeader;
  });
