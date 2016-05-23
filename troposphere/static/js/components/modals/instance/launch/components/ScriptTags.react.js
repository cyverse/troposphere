import React from 'react';

export default React.createClass({

    onRemove: function(item) {
        this.props.onRemove(item)
    },

    renderTag: function (item, i) {
        if (item) {
            return (
                <a key={i} className="tag"
                    onClick={this.onRemove.bind(this, item)}
                >
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
