define(function (require) {

  var React = require('react/addons'),
      moment = require('moment'),
      Backbone = require('backbone'),
      Time = require('components/common/Time.react'),
      Gravatar = require('components/common/Gravatar.react'),
      AvailabilityView = require('../availability/AvailabilityView.react'),
      CryptoJS = require('crypto-js'),
      stores = require('stores');

  return React.createClass({
    displayName: 'Version',

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      version: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      onEditClicked: React.PropTypes.func,
      editable: React.PropTypes.bool,
      showAvailability: React.PropTypes.bool,
    },
    getDefaultProps: function(){
      return {
        showAvailability: true,
        editable: true
      }
    },
    onEditClicked: function() {
         return this.props.onEditClicked(this.props.version);
    },
    renderAvailability: function() {
      var version = this.props.version;
      if (!this.props.showAvailability) {
        return;
      }

      return (<AvailabilityView
        version={version}
        />);
    },

    renderEditLink: function () {
        //NOTE: Undefined/null/etc. defaults to "TRUE" case.
         if (this.props.editable == false) {
             return;
         }
         var profile = stores.ProfileStore.get(),
           version = this.props.version,
           image = this.props.image;
         if(!profile.id || !profile.get('username')) {
           return;
         }
         var username = profile.get('username');
         //TODO: Bring up discrepencies in the API here..
         if (username === version.get('user').username || username === image.get('created_by').username || profile.get('is_staff')) {
             return (
                 <div className="edit-link-row">
                     <a className="edit-link" onClick={this.onEditClicked}><span className="glyphicon glyphicon-pencil"></span> Edit Version</a>
                 </div>
             )
         }
    },
    renderDateString: function(version) {
      var date_str;

      if(version.get('end_date')) {
        var dateCreated = moment(version.get('start_date')).format("M/DD/YYYY hh:mm a"),
          dateArchived = moment(version.get('end_date')).format("M/DD/YYYY hh:mm a");

          date_str = dateCreated + " - " + dateArchived;
      } else {
        var dateCreated = moment(version.get('start_date')).format("M/DD/YYYY hh:mm a");

          date_str = dateCreated;
      }
      return ({date_str});

    },
    render: function () {
      // todo: figure out if anything is ever recommended, or if it's just a concept idea
      var version = this.props.version,
          image = this.props.image,
          isRecommended = false,
          dateCreated = moment(version.start_date).format("M/DD/YYYY hh:mm a"),
          versionHash = CryptoJS.MD5(version.id.toString()).toString(),
          iconSize = 63,
          type = stores.ProfileStore.get().get('icon_set'),
          owner = image.get('created_by').username;

      return (
        <li className="app-card">
          <div>
            <span className="icon-container">
              <Gravatar hash={versionHash} size={iconSize} type={type}/>
            </span>
            <div className="image-version-details app-name">
              <div className="version">
                <h4>
                  {version.get('name')}
                </h4>
                {isRecommended ? <span className="recommended-tag">Recommended</span> : null}

                {this.renderDateString(version)} by {owner} <br />
              </div>
                {this.renderEditLink()}
                {this.renderAvailability()}
            </div>

          </div>
        </li>
      );
    }

  });

});
