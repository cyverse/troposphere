define(['react', 'components/page_header'], function(React, PageHeader) {
    return React.createClass({
        render: function() {
            var volume = this.props.volume;
            console.log(volume);
            return PageHeader({title: "Volume: " + volume.get('name_or_id')})
        }
    });
});
