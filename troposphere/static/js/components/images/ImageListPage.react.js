define(function (require) {

  var React = require('react/addons'),
    stores = require('stores'),
    ImageListView = require('./list/ImageListView.react');

  return React.createClass({
    displayName: "ImageListPage",

    render: function () {
      var tags = stores.TagStore.getAll(),
        helpLinks = stores.HelpLinkStore.getAll();

      if (!tags || !helpLinks){
        return <div className="loading"></div>;
      }

      return (
        <ImageListView tags={tags}/>
      );
    }

  });

});
