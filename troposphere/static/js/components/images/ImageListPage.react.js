define(function (require) {

  var React = require('react'),
    stores = require('stores'),
    ImageListView = require('./list/ImageListView.react');

  return React.createClass({

    render: function () {
      var tags = stores.TagStore.getAll();

      if (!tags) return <div className="loading"></div>;

      return (
        <ImageListView tags={tags}/>
      );
    }

  });

});
