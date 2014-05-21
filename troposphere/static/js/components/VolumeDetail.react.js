/** @jsx React.DOM */

define(
  [
    'react',
    './VolumeDetailPage.react',
    'collections/instances'
  ],
  function (React, VolumeDetailPage, Instances) {

    return React.createClass({

      getInitialState: function () {
        return {
          instances: null,
          volume: this.props.volume
        };
      },

      setVolume: function (volume) {
        this.setState({volume: volume});
      },

      setInstances: function (instances) {
        if (this.isMounted()) this.setState({instances: instances});
      },

      componentDidMount: function () {
        var provider_id = this.props.volume.get('identity').provider;
        var identity_id = this.props.volume.get('identity').id;
        var instances = new Instances([], {provider_id: provider_id, identity_id: identity_id});
        instances.on('sync', this.setInstances);
        instances.fetch();

        this.state.volume.on('change', this.setVolume);
      },

      componentWillUnmount: function () {
        if (this.state.instances) this.state.instances.off('sync', this.setInstances);
        this.state.volume.off('change', this.setVolume);
      },

      render: function () {
        return (
          <VolumeDetailPage
            volume={this.state.volume}
            instances={this.state.instances}
            providers={this.props.providers}
          />
        );
      }

    });

  });
