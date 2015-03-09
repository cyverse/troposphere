define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      Time = require('components/common/Time.react'),
      Gravatar = require('components/common/Gravatar.react'),
      CryptoJS = require('crypto'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      // todo: figure out if anything is ever recommended, or if it's just a concept idea
      var machine = this.props.machine,
          isRecommended = false,
          dateCreated = this.props.machine.get('start_date').format("M/DD/YYYY"),
          machineHash = CryptoJS.MD5(this.props.machine.id.toString()).toString(),
          iconSize = 63,
          type = stores.ProfileStore.get().get('icon_set');

      return (
        <li>
          <div>
            <Gravatar hash={machineHash} size={iconSize} type={type}/>
            <div className="image-version-details">
              <div className="version">
                {machine.get('pretty_version')}
                {isRecommended ? <span className="recommended-tag">Recommended</span> : null}
              </div>
              <div>{dateCreated}</div>
              <div>{machine.get('ownerid')}</div>
            </div>
          </div>
        </li>
      );
    }

  });

});
