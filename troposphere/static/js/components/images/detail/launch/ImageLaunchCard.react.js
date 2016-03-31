import React from 'react';
import Gravatar from 'components/common/Gravatar.react';
import Backbone from 'backbone';
import Bookmark from 'components/images/common/Bookmark.react';
import context from 'context';
import stores from 'stores';


// Note:
// -----
// pulled out of a defunct module called 'url', in history you can
// see it -> `troposphere/static/js/url.js`. This module was used
// for building internal, in-app links prior to the adoption of
// React-Router. When the Public Image Catalog was re-introduced,
// @lenards (me) carelessly added back the "Login to Launch"
// functionality without properly wiring in the internal URLs
//
// this is a stop-gap, but not a full fix
//
// FIXME: use React-Router Link objects or external link + push state
let buildImageUrl = function (model) {
    return '/application/images/' + model.id;
}

let buildLoginUrl = function () {
    return '/login'
}


export default React.createClass({
      displayName: "ImageLaunchCard",

      propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        onLaunch: React.PropTypes.func.isRequired
      },

      render: function () {
        var image = this.props.image;
        var versions = stores.ImageStore.getVersions(image.id);
        var type = stores.ProfileStore.get().get('icon_set');
        var userLoggedIn = (context.profile && context.profile.get('selected_identity'));

        var iconSize = 145;
        // always use the Gravatar icons
        var icon = (
            <Gravatar hash={image.get('uuid_hash')} size={iconSize} type={type}/>
          );

        // Hide bookmarking on the public page
        var bookmark;
        if (userLoggedIn) {
          bookmark = (
            <Bookmark image={image}/>
          );
        }
        //When versions is 'not loaded' OR 'has length > 0', you can launch.
        var canLaunch = (versions !== null && versions.length !== 0) ? true : false;
        var button;
        if (userLoggedIn) {
          button = (
            <button className='btn btn-primary launch-button'
                onClick={this.props.onLaunch}
                disabled={!canLaunch}>
              Launch
            </button>
          );
        } else {
            // Move this to using a more React-Router friendly approach
            var loginUrl = buildLoginUrl(),
                imageUrl = buildImageUrl(this.props.image),
                fullUrl = loginUrl + "?redirect_to=" + imageUrl +
                    "?beta=true&airport_ui=false";

          button = (
            <a className='btn btn-primary launch-button' href={fullUrl}>
              Login to Launch
            </a>
          );
        }

        return (
          <div className='image-launch-card'>
            <div className='icon-container'>
              <a>
                {icon}
              </a>
            </div>
            {button}
            {bookmark}
          </div>
        );
      }
});
