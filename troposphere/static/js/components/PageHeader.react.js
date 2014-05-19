/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Glyphicon.react'
  ],
  function (React, Glyphicon) {

    return React.createClass({

      getInitialState: function () {
        return {showHelpText: false};
      },

      render: function () {
        var help_button = [];
        var help_text = [];

        if (this.props.helpText) {
          help_button = (
            <button type='button' id='help-text-toggle-button' className='btn btn-default' onClick={this.showHelpText}>
              <Glyphicon name='question-sign'/>
            </button>
          );

          var helpTextStyle = {
            display: this.state.showHelpText ? 'block' : 'none'
          };

          help_text = (
            <div id='help-text' style={helpTextStyle}>
              <div className='well'>
                {this.props.helpText()}
              </div>
            </div>
          );
        }

        return (
          <div className="main-page-header">
            <h1>{this.props.title}</h1>
            {help_button}
            {help_text}
          </div>
        );
      },

      showHelpText: function () {
        this.setState({showHelpText: !this.state.showHelpText});
      }

    });

  });
