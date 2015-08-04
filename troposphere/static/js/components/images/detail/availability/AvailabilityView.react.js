define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores');

    return React.createClass({
        displayName: "AvailabilityView",

        propTypes: {
            version: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

      renderProviderMachine: function (provider_machine) {
        if(!provider_machine.end_date || !provider_machine.end_date.isValid()) {
          return;
        }

        return (
          <div key={provider_machine.id}>
            {provider_machine.provider.name} - {provider_machine.uuid}
          </div>
        )
      },
      renderBody: function () {
        var machines = stores.ImageVersionStore.getMachines(this.props.version.id);

        if(machines == null) {
          return (<div className="content col-md-10">
            <div className="loading"/>
          </div>);
        }
        return (
          <div className="content col-md-10">
              {machines.map(this.renderProviderMachine)}
          </div>
        );
      },
      render: function() {
        return (
          <div className='version-availability image-info-segment row'>
            <h4 className="title col-md-2">Available on</h4>
              {this.renderBody()}
          </div>
        );

      }
    });

});
