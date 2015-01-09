/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/Gravatar.react',
    'crypto',
    'stores'
  ],
  function (React, Backbone, Time, Gravatar, CryptoJS, stores) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        console.log(this.props.machine.id);
        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        var isRecommended = false;
        var dateCreated = this.props.machine.get('start_date').format("M/DD/YYYY");

        var machineHash = CryptoJS.MD5(this.props.machine.id).toString();
        var iconSize = 63;
        var type = stores.ProfileStore.get().get('icon_set');

        return (
          <li>
            <div>
              <Gravatar hash={machineHash} size={iconSize} type={type}/>
              <div className="image-version-details">
                <div className="version">
                  {this.props.machine.get('pretty_version')}
                  {isRecommended ? <span className="recommended-tag">Recommended</span> : null}
                </div>
                <div>{dateCreated}</div>
                <div>{this.props.machine.get('ownerid')}</div>
              </div>
            </div>
          </li>
        );
      }

    });

  });
