define(function (require) {

  var React = require('react'),
    stores = require('stores'),
    ApplicationListView = require('./list/ApplicationListView.react');

  return React.createClass({

    render: function () {
      var tags = stores.TagStore.getAll();

      if (!tags) return <div className="loading"></div>;

      return (
        <ApplicationListView tags={tags}/>
      );
    }

  });

});
