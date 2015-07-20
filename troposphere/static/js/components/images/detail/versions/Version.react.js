define(function (require) {

  var React = require('react'),
      moment = require('moment'),
      Backbone = require('backbone'),
      Time = require('components/common/Time.react'),
      Gravatar = require('components/common/Gravatar.react'),
      CryptoJS = require('crypto'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      version: React.PropTypes.object.isRequired,
      onEditClicked: React.PropTypes.func,
      editable: React.PropTypes.bool
    },
    onEditClicked: function() {
         return this.props.onEditClicked(this.props.version);
    },
    renderEditLink: function (image) {
        //NOTE: Undefined/null/etc. defaults to "TRUE" case.
         if (this.props.editable == false) {
             return;
         }
         var profile = stores.ProfileStore.get(),
             image = this.props.image;

         if (profile.id && profile.get('username') === image.get('created_by').username) {
             return (
                 <div className="edit-link-row">
                     <a className="edit-link" onClick={this.onEditClicked}>Edit Version</a>
                 </div>
             )
         }
    },
    renderDateString: function(version) {
      var date_str;

      if(version.get('end_date')) {
        var dateCreated = moment(version.get('start_date')).format("M/DD/YYYY"),
          dateArchived = moment(version.get('end_date')).format("M/DD/YYYY");

          date_str = dateCreated + " - " + dateArchived;
      } else {
        var dateCreated = moment(version.get('start_date')).format("M/DD/YYYY");

          date_str = dateCreated;
      }
      return (<div> {date_str} </div>);

    },
    render: function () {
      // todo: figure out if anything is ever recommended, or if it's just a concept idea
      var version = this.props.version,
          image = this.props.image,
          isRecommended = false,
          dateCreated = moment(version.start_date).format("M/DD/YYYY"),
          versionHash = CryptoJS.MD5(version.id.toString()).toString(),
          iconSize = 63,
          type = stores.ProfileStore.get().get('icon_set'),
          owner = image.get('created_by').username;

      return (
        <li>
          <div>
            <Gravatar hash={versionHash} size={iconSize} type={type}/>
            <div className="image-version-details">
              <div className="version">
                {version.name}
                {isRecommended ? <span className="recommended-tag">Recommended</span> : null}
              </div>
              {this.renderDateString(version)}
              <div>{owner}</div>
              {this.renderEditLink()}
            </div>
          </div>
        </li>
      );
    }

  });

});
