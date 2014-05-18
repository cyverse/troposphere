/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({
      getInitialState: function () {
        return {
          content: ""
        };
      },

      onSubmit: function (e) {
        e.preventDefault();
        console.log(e);
        console.log(this.state.content);
        /* TODO: Send support request */
      },

      handleChange: function (e) {
        this.setState({content: event.target.value});
      },

      render: function () {
        return (
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <textarea className="form-control" rows="5" onChange={this.handleChange}>
                {this.state.content}
              </textarea>
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Send"/>
            </div>
          </form>
        );
      }

    });

  });
