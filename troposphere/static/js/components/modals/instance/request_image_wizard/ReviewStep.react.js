define(function(require) {

  var React = require('react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      imageData: React.PropTypes.object.isRequired
    },

    isSubmittable: function(){
      return true;
    },

    onNext: function(){
      this.props.onNext({
        visibility: this.state.visibility
      });
    },

    renderBody: function (imageData) {
      return (
        <div>
          <p>{"An image request will be submitted with the following information:"}</p>
          <p>{JSON.stringify(imageData, null, 4)}</p>
        </div>
      );
    },

    render: function () {
      var imageData = this.props.imageData;

      return (
        <div>
          <div className="modal-body">
            {this.renderBody(imageData)}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default cancel-button pull-left" onClick={this.props.onPrevious}>
              <span className="glyphicon glyphicon-chevron-left"></span>
              Back
            </button>
            <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext} disabled={!this.isSubmittable()}>
              Request Image
            </button>
          </div>
        </div>
      );
    }

  });

});
