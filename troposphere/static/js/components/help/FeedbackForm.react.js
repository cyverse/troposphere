/** @jsx React.DOM */

define(
  [
    'react',
    'actions/HelpActions'
  ],
  function (React, HelpActions) {

    return React.createClass({
      getInitialState: function () {
        return {
          content: ""
        };
      },

      onSubmit: function (e) {
        e.preventDefault();
        var feedback = e.target.value;
        HelpActions.sendFeedback(feedback);
      },

      onTextChange: function (e) {
        var feedback = e.target.value;
        this.setState({content: feedback});
      },

      render: function () {
        var isDisabled = this.state.content ? false : true;
        return (
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <textarea className="form-control" rows="5" onChange={this.onTextChange} value={this.state.content}/>
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Send" disabled={isDisabled}/>
            </div>
          </form>
        );
      }

    });

  });
