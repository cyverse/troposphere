define(function (require) {

  var React = require('react'),
      Backbone = require('backbone'),
      ResourceDetail = require('components/projects/common/ResourceDetail.react'),
      stores = require('stores');

  return React.createClass({

    propTypes: {
      volume: React.PropTypes.instanceOf(Backbone.Model).isRequired
    },

    render: function () {
      var volume = this.props.volume,
          provider = stores.ProviderStore.get(volume.get('provider'));

      if(!provider) return <div className="loading"></div>;

      return (
        <ResourceDetail label="Provider">
          {provider.get('name')}
        </ResourceDetail>
      );
    }

  });

});
