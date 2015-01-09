/** @jsx React.DOM */

define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({

      propTypes: {
        application: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      renderProvider: function(provider){

      },

      renderProviders: function(machines){
        var providers = machines.map(function(machine){
          var provider = this.props.providers.get(machine.get('provider'));
          return (
            <li key={provider.id}>{provider.get('location')}</li>
          )
        }.bind(this));

        return (
          <ul className="list-unstyled">
            {providers}
          </ul>
        )
      },

      render: function () {
        var machines = this.props.application.get('machines');
        return (
          <div className='image-availability image-info-segment row'>
            <h4 className="title col-md-2">Available on</h4>
            <div className="content col-md-10">
              {this.renderProviders(machines)}
            </div>
          </div>
        );
      }

    });

  });
