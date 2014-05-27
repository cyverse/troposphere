/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/common/Time.react'
  ],
  function (React, _, Time) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        var volume = this.props.volume;
        var providerId = volume.get('identity').provider;
        var provider = this.props.providers.get(providerId);
        // todo: use defaults to set name in the model
        var name = volume.get('name') || "(Unnamed Volume)";

        var items = [
          ["Name", name],
          ["ID", volume.id],
          ["Provider", provider.get('name')],
          ["Date Created", Time({date: volume.get('start_date')})]
        ];

        var details = _.map(items, function (item) {
          return [
            React.DOM.dt({}, item[0]),
            React.DOM.dd({}, item[1])
          ];
        });

        return (
          <div>
            <h2>Details</h2>
            <dl>{details}</dl>
          </div>
        );
      }

    });

  });
