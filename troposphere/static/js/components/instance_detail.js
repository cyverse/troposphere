define(['react', 'components/page_header'], function(React, PageHeader) {
    return React.createClass({
        render: function() {
            var instance = this.props.instance;
            console.log(instance);
            return PageHeader({title: "Instance: " + instance.get('name_or_id')})
        }
    });
});
