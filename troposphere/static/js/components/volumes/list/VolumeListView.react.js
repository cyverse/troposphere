/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'url',
    'components/common/PageHeader.react',
    'backbone'
  ],
  function (React, _, URL, PageHeader, Backbone) {

    return React.createClass({

      propTypes: {
        volumes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      onChange: function(volume, e){
        var command = e.target.value;
        var volumeName = volume.get('name');
        if(command === "attach"){
          console.log("attach" + volumeName);
        }else if(command === "detach"){
          console.log("detach" + volumeName);
        }else if(command === "destroy"){
          console.log("destroy" + volumeName);
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
        var placeholderMessage = "Attached to iPlant Base Instance";
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

          return (
            <tr>
              <td>
                <a href={volumeDetailsUrl}>
                  {volumeName}
                </a>
              </td>
              <td>{description}</td>
              <td>
                { volume.get('status') === "available" ? this.getVolumeAttachOptions(volume) : this.getVolumeDetachOptions(volume) }
              </td>
              <td>
                200 GB on <a href="#">iPlant Cloud - Tucson</a>
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
