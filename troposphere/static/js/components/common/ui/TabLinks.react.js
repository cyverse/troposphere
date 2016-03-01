import React from 'react';

export default React.createClass({
    getInitialState: function() {
        let active = this.props.linkList[0];
        return ({
            active
        })
    },

    onChangeView: function(item) {
        this.setState({
            active: item
        })
        this.props.onChangeView(item);
    },

    renderLinks: function(item) {
        let active = "";
        if (item === this.state.active) {
            active = "TabLinks--active";
        }

        return (
            <li className="TabLinks-link">
                <a className={active}
                    onClick={this.onChangeView.bind(this, item)}
                >
                    {item}
                </a>
            </li>
        )
    },

    render: function() {
        return (
            <ul className="TabLinks clearFix">
                {this.props.linkList.map(this.renderLinks)}
            </ul>
        )
    }
});
