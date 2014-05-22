/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/common/Time.react'
  ],
  function (React, _, Time) {

    return React.createClass({

      render: function () {
        var volume = this.props.volume;
        var provider = this.props.providers.get(volume.get('identity').provider);
        var name = "(Unnamed Volume)";
        if (volume.get('name') !== undefined) name = volume.get('name');

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
