define(function(require) {

  var React = require('react'),
      Name = require('../request_image/ImageName.react'),
      Description = require('../request_image/ImageDescription.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      instance: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    getInitialState: function(){
      return {
        name: "",
        description: "",
        checkCreate: true
      }
    },

    onNext: function(){
      this.props.onNext({
        name: this.state.name,
        description: this.state.description
      });
    },

    onNameChange: function(newName){
      this.setState({name: newName});
    },

    onDescriptionChange: function(newDescription){
      this.setState({description: newDescription});
    },

    renderBody: function (instance) {
      return (
        <div>
          <Name
            create={this.state.checkCreate}
            value={this.state.name}
            onChange={this.onNameChange}
          />
          <Description onChange={this.onDescriptionChange}/>
        </div>
      );
    },

    render: function () {
        var instance = this.props.instance;

        return (
          <div>
            <div className="modal-body">
              {this.renderBody(instance)}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary cancel-button" onClick={this.onNext}>
                Next
              </button>
            </div>
          </div>
        );
      }

  });

});
