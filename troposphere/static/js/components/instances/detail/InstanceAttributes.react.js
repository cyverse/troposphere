/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/Time.react'
  ],
  function (React, Time) {

    return React.createClass({

      renderPair: function (k, v) {
        return [
          <dt>{k}</dt>,
          <dd>{v}</dd>
        ];
      },

      renderIdentity: function (identity) {
        var text = identity.id + " on provider " + this.props.provider.get('name');
        return text;
      },

      render: function () {
        var instance = this.props.instance;
        var status = instance.get('status');
        var publicIp = instance.get('public_ip_address');
        var addr = publicIp ? publicIp : <em>Unknown</em>;
        var identity = this.renderIdentity(instance.get('identity'));
        var dateLaunched = (
          <Time date={instance.get("start_date")}/>
        );

        return (
          <div>
            <h2>Details</h2>
            <dl>
              {this.renderPair("Status", status)}
              {this.renderPair("IP Address", addr)}
              {this.renderPair("Identity", identity)}
              {this.renderPair("ID", instance.id)}
              {this.renderPair("Date Launched", dateLaunched)}
            </dl>
          </div>
        );
      }
    });

  });
