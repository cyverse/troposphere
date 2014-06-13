/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'url',
    'components/common/PageHeader.react',
    'backbone',
    'actions/VolumeActions'
  ],
  function (React, _, URL, PageHeader, Backbone, VolumeActions) {

    return React.createClass({

      propTypes: {
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      onChange: function(volume, e){
        var command = e.target.value;
        var volumeName = volume.get('name');
        if(command === "attach"){
          VolumeActions.attach(volume);
        }else if(command === "detach"){
          VolumeActions.detach(volume);
        }else if(command === "destroy"){
          VolumeActions.destroy(volume);
        }
        e.target.value = e.target.options[0].value;
      },

      getVolumeAttachOptions: function(volume){
        var placeholderMessage = "Unattached";
        return (
          <select name="tags" data-placeholder={placeholderMessage} className="form-control" onChange={this.onChange.bind(this, volume)}>
            <option>{placeholderMessage}</option>
            <option value="attach">Attach to...</option>
            <option value="destroy">Destroy</option>
          </select>
        );
      },

      getVolumeDetachOptions: function(volume){
        var attachData = volume.get('attach_data')
        var instance = this.props.instances.get(attachData.instance_id);
        var placeholderMessage = "Attached to " + instance.get('name') + " as device " + attachData.device;
        return (
          <select name="tags" data-placeholder={placeholderMessage} className="form-control" onChange={this.onChange.bind(this, volume)}>
            <option>{placeholderMessage}</option>
            <option value="detach">Detach</option>
          </select>
        );
      },

      render: function () {
        var volumes = this.props.volumes.map(function (volume) {
          var volumeName = volume.get('name');
          var description = volume.get('description') || "No description provided.";
          var volumeDetailsUrl = URL.volume(volume, {absolute: true});
          var volumeStatus = volume.get('status');
          var volumeProvider = this.props.providers.get(volume.get('identity').provider);
          var volumeOptions;
          if(volumeStatus === "available"){
            volumeOptions = this.getVolumeAttachOptions(volume);
          }else if(volumeStatus === "in-use"){
            volumeOptions = this.getVolumeDetachOptions(volume)
          }else{
            volumeOptions = volumeStatus;
          }

          return (
            <tr key={volume.id || volume.cid}>
              <td>
                {volumeName}
              </td>
              <td>{description}</td>
              <td>
                {volumeOptions}
              </td>
              <td>
                200 GB on <strong>{volumeProvider.get('name')}</strong>
              </td>
            </tr>
          );
        }.bind(this));

        var helpText = function(){
          return (
            <div>
              <p>This page shows volumes you've created across all providers</p>
            </div>
          );
        };

        return (
          <div>
            <PageHeader title="All Volumes" helpText={helpText}/>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Size, Provider</th>
                </tr>
              </thead>
              <tbody>
                {volumes}
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
