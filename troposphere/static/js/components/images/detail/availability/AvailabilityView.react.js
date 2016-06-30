define(function (require) {

    var _ = require('underscore'),
        React = require('react/addons'),
        Backbone = require('backbone'),
        stores = require('stores');

    return React.createClass({
        displayName: "AvailabilityView",

        propTypes: {
            version: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

      renderProviderMachine: function (provider_machine) {
        // Hide 'end-dated' provider_machines
        let endDate = provider_machine.get("end_date");
        if(endDate && endDate.isValid()) {
          return;
        }

        return (
          <div key={provider_machine.get("id")}>
            {provider_machine.get("provider").name} - {provider_machine.get("uuid")}
          </div>
        )
      },
      renderBody: function () {
        var machines = stores.ProviderMachineStore.getMachinesForVersion(this.props.version);

        if (!machines) {
          return (<div className="content col-md-10">
            <div className="loading"/>
          </div>);
        }
        return (
          <div className="content">
              {machines.map(this.renderProviderMachine)}
          </div>
        );
      },
      render: function() {
        return (
          <div className='version-availability' style={{marginTop:"20px"}}>
            <h4 className="t-title" style={{marginBottom:"10px"}}>Available on: </h4>
              {this.renderBody()}
          </div>
        );

      }
    });

});
