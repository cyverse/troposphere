/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      //
      // Mounting & State
      // ----------------
      //

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onPrevious: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
      },

      //
      // Callbacks
      //

      onBack: function(){
        this.props.onPrevious(this.props.image);
      },

      onLaunch: function(){
        this.props.onNext(this.props.image);
      },

      //
      // Render
      // ------
      //

      renderBody: function () {
        var image = this.props.image;

        return (
          <div>Launch Image</div>
        );
      },

      render: function () {
        return (
          <div>
            <div className="modal-body">
              {this.renderBody()}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default cancel-button" onClick={this.onBack}>
                Back
              </button>
              <button type="button" className="btn btn-primary cancel-button" onClick={this.onLaunch}>
                Launch
              </button>
            </div>
          </div>
        );
      }

    });

  });
