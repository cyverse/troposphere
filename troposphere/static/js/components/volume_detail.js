define(['react', 'underscore', 'components/page_header'], function(React, _, PageHeader) {
    var VolumeDetail = React.createClass({
        helpText: function() {
            var p1 = React.DOM.p({}, "A volume is available when it is not attached to an instance. Any newly created volume must be formatted and then mounted after it has been attached before you will be able to use it.");
            var links = [
                ["Creating a Volume", "https://pods.iplantcollaborative.org/wiki/x/UyWO"],
                ["Attaching a Volume to an Instance", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachingaVolumetoanInstance-Attachingavolumetoaninstance"],
                ["Formatting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step5%3ACreatethefilesystem%28onetimeonly%29."],
                ["Mounting a Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step6%3AMountthefilesystemonthepartition."],
                ["Unmounting and Detaching Volume", "https://pods.iplantcollaborative.org/wiki/x/OKxm#AttachinganEBSVolumetoanInstance-Step7%3AUnmountanddetachthevolume."]
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
            return PageHeader({title: "Volume: " + volume.get('name_or_id'), helpText: this.helpText})
        }
    });

    return VolumeDetail;
});
