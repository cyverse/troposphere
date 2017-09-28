import React from "react";
import Backbone from "backbone";
import SelectMenu from "components/common/ui/SelectMenu";


export default React.createClass({
    displayName: "EditVisibilityView",

    propTypes: {
        image: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        value: React.PropTypes.bool.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    onVisibilityChange: function(visibility_opt) {
        let value = visibility_opt.name,
            is_public = (value == "Public");
        this.setState({
            is_public,
        });
        this.props.onChange(value);
    },


    render: function() {
        var is_public = this.props.value,
            public_opt = {name: 'Public'},
            private_opt = {name: 'Private'},
            options = [public_opt, private_opt],
            current = (is_public) ? public_opt: private_opt;

        return (
        <div className="image-info-segment">
            <h4 className="t-body-2">Visibility</h4>
            <SelectMenu current={current}
                list={options}
                optionName={ opt => opt.name }
                onSelect={this.onVisibilityChange} />
        </div>
        );
    }
});
