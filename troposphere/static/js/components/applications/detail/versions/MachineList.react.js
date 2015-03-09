define(function (require) {

  var React = require('react'),
      Machine = require('./Machine.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      machines: React.PropTypes.instanceOf(Backbone.Collection).isRequired
    },

    renderMachine: function(machine){
      return (
        <Machine
          key={machine.id}
          machine={machine}
        />
      );
    },

    render: function () {
      return (
        <div className="content col-md-10">
          <ul>
            {this.props.machines.map(this.renderMachine)}
          </ul>
        </div>
      );
    }

  });

});
