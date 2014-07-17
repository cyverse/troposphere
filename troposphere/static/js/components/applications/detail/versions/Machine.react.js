/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'moment'
  ],
  function (React, Backbone, Time, moment) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        var isRecommended = false;
        var dateCreated = moment(this.props.machine.get('start_date')).format("M/DD/YYYY");

        return (
          <li>
            <div>
              <img className="image-version-image" src="http://placehold.it/75x75"/>
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
