/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'moment',
    'components/common/Gravatar.react',
    'crypto'
  ],
  function (React, Backbone, Time, moment, Gravatar, CryptoJS) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        var isRecommended = false;
        var dateCreated = moment(this.props.machine.get('start_date')).format("M/DD/YYYY");

        var machineHash = CryptoJS.MD5(this.props.machine.id);
        var iconSize = 63;

        return (
          <li>
            <div>
              <Gravatar hash={machineHash} size={iconSize}/>
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
