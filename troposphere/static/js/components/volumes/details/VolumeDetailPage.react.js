/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'components/common/PageHeader.react',
    './VolumeInfo.react',
    './AttachmentInfo.react',
    'backbone'
  ],
  function (React, _, PageHeader, VolumeInfo, AttachmentInfo, Backbone) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      helpText: function () {
        var p1 = (
          <p>
            {
            "A volume is available when it is not attached to an instance. " +
            "Any newly created volume must be formatted and then mounted after " +
            "it has been attached before you will be able to use it."
            }
          </p>
        );

        var links = [
          ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
          ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
          ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Createthefilesystem%28onetimeeventpervolume%29"],
          ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Mountthefilesystemonthepartition"],
          ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Detachingvolumesfrominstances"]
        ];

        var links = _.map(links, function (item) {
          return (
            <li>
              <a href={item[1]}>
                {item[0]}
              </a>
            </li>
          );
        });

        var p2 = (
          <p>
            More information about volumes:
            <ul>{links}</ul>
          </p>
        );

        return (
          <div>
            {p1}
            {p2}
          </div>
        );
      },

      render: function () {
        return (
          <div>
            <PageHeader title={"Volume: " + this.props.volume.get('name_or_id')} helpText={this.helpText}/>
            <VolumeInfo volume={this.props.volume} providers={this.props.providers}/>
            <AttachmentInfo volume={this.props.volume} instances={this.props.instances} providers={this.props.providers}/>
          </div>
        );
      }

    });

  });
