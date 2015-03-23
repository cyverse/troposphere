define(function (require) {

  var React = require('react'),
      SecondaryApplicationNavigation = require('./common/SecondaryApplicationNavigation.react'),
      ApplicationCardList = require('./list/list/ApplicationCardList.react'),
      stores = require('stores');

  return React.createClass({

    renderBody: function(){
      var profile = stores.ProfileStore.get(),
          images = stores.ApplicationStore.getUserImages(profile),
          tags = stores.TagStore.getAll(),
          imagingDocsUrl = "https://pods.iplantcollaborative.org/wiki/display/atmman/Requesting+an+Image+of+an+Instance";

      if(!images || !tags) return <div className="loading"></div>;

      if(images.length === 0){
        return (
          <p>
            {"You have not created any images. To learn how to create an image, please refer to the "}
            <a href={imagingDocsUrl} target="_blank">documention on imaging</a>
            {"."}
          </p>
        );
      }

      return (
        <ApplicationCardList applications={images}/>
      );
    },

    render: function () {
      return (
        <div className="container">
          {this.renderBody()}
        </div>
      );
    }

  });

});
