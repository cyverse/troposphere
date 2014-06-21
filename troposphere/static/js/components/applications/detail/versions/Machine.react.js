/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react'
  ],
  function (React, Backbone, Time) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        return (
          <li>
            <div>
              <img className="image-version-image" src="http://placehold.it/75x75"/>
              <div className="image-version-details">
                <div className="version">
                  v.0.12.3
                  <span className="recommended-tag">Recommended</span>
                </div>
                <div>2/15/2014</div>
                <div>author_username</div>
              </div>
            </div>
            <button className="btn btn-primary launch-button">Launch this Version</button>
          </li>
        );

//        return (
//          <li>
//            <img src="http://placehold.it/53x53"/>
//            <div className="image-version-details">
//              {this.props.machine.get('pretty_version')}
//              <Time date={this.props.machine.get('start_date')} showRelative={false}/>
//              {"jchansen"}
//            </div>
//          </li>
//        );
      }

    });

  });
