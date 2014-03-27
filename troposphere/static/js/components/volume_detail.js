define(['react', 'underscore', 'components/page_header',
'components/common/time', 'providers'], function(React, _, PageHeader, Time, providers) {

    var VolumeInfo = React.createClass({
        render: function() {
            var volume = this.props.volume;
            var provider = providers.get(volume.get('provider'));
            var name = "(Unnamed Volume)";
            if (volume.get('name') !== undefined)
                name = volume.get('name');

            var items = [
                ["Name", name],
                ["ID", volume.id],
                ["Provider", provider.get('name')],
                ["Date Created", Time({date: volume.get('create_time')})]
            ];

            var result = React.DOM.dl({}, _.map(items, function(item) {
                return [
                    React.DOM.dt({}, item[0]),
                    React.DOM.dd({}, item[1])
                ];
            }));
            return result;
        }
    });

    var VolumeDetail = React.createClass({
        helpText: function() {
            var p1 = React.DOM.p({}, "A volume is available when it is not attached to an instance. Any newly created volume must be formatted and then mounted after it has been attached before you will be able to use it.");
            var links = [
                ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
                ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
                ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Createthefilesystem%28onetimeeventpervolume%29"],
                ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Mountthefilesystemonthepartition"],
                ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Detachingvolumesfrominstances"]
            ];
            var link_list = React.DOM.ul({}, _.map(links, function(item) {
                return React.DOM.li({}, React.DOM.a({href: item[1]}, item[0]));
            }));
            var p2 = React.DOM.p({}, "More information about volumes:", link_list);
            return React.DOM.div({}, p1, p2);
        },
        render: function() {
            var volume = this.props.volume;
            console.log(volume);
            return React.DOM.div({}, 
                PageHeader({title: "Volume: " + volume.get('name_or_id'), helpText: this.helpText}),
                VolumeInfo({volume: volume}));
        }
    });

    return VolumeDetail;
});
