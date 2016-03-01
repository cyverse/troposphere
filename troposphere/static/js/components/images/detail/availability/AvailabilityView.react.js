import _ from 'underscore';
import React from 'react';
import Backbone from 'backbone';
import stores from 'stores';

export default React.createClass({
        displayName: "AvailabilityView",

        propTypes: {
            version: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

      renderProviderMachine: function (provider_machine) {
        //Hide 'end-dated' provider_machines
        //TODO: Only hide when end_date > now
        if(provider_machine.end_date && provider_machine.end_date.isValid()) {
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
