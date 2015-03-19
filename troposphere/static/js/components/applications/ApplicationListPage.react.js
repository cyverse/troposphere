define(function (require) {

  var React = require('react'),
      stores = require('stores'),
      ApplicationListView = require('./list/ApplicationListView.react');

  return React.createClass({

    render: function () {
      var images = stores.ApplicationStore.getAll(),
          tags = stores.TagStore.getAll();

      if(!images || !tags) return <div className="loading"></div>;

      return (
        <ApplicationListView
          applications={images}
          tags={tags}
        />
      );
    }

  });

});
