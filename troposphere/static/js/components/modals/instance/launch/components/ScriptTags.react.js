import React from 'react/addons';

export default React.createClass({
    propTypes: {
        onRemove: React.PropTypes.func.isRequired,
        scripts: React.PropTypes.instanceOf(Backbone.Modal).isRequired
    },

    onRemove: function(item) {
        this.props.onRemove(item)
    },

    renderTag: function (item) {
        if (item) {
            return (
                <a className="tag" onClick={this.onRemove.bind(this, item)}>
                    {item.get('title') + " "}
                    <span className="tag__x glyphicon glyphicon-remove"/>
                </a>
            )
        }
    },
    
    render: function(){

        return (
            <div>
                {this.props.scripts.map(this.renderTag)}
            </div>
        )
    }
});
