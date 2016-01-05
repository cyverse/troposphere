import React from 'react/addons';

export default React.createClass({

    onRemove: function(item) {
        this.props.onRemove(item)
    },

    renderTag: function (item) {
        if (item) {
            return (
                <a className="btn btn-small btn-default" 
                    onClick={this.onRemove.bind(this, item)}
                >
                    {item.get('title') + " "}
                    <span className="glyphicon glyphicon-remove"/>
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
