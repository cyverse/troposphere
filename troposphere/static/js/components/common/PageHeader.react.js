import React from 'react/addons';
import Glyphicon from 'components/common/Glyphicon.react';

export default React.createClass({
    displayName: "PageHeader",

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

      // todo: delete this line when it's official that we aren't going to include
      // descriptive help in the header. I think we should take it out because users
      // don't need to see it once they understand how the app works, and it we have
      // to explain what things are in long text then we've done something wrong :(
      // return (
      //   <div className="main-page-header">
      //     <h1>{this.props.title}</h1>
      //     {help_button}
      //     {help_text}
      //   </div>
      // );

      return (
        <div className="main-page-header">
          <h1>{this.props.title}</h1>
        </div>
      );
    },

    showHelpText: function () {
      this.setState({showHelpText: !this.state.showHelpText});
    }
});
