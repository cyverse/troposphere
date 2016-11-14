import React from "react";
import Backbone from "backbone";


export default React.createClass({
    displayName: "SelectMenu2",

    propTypes: {
        onSelect: React.PropTypes.func.isRequired,
        optionName: React.PropTypes.func.isRequired,
        list: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Backbone.Collection),
            React.PropTypes.array
        ]),
        current: React.PropTypes.object,
        findIndex: React.PropTypes.func
    },

    onSelect(e) {
        let index = Number(e.target.value);
        let list = this.props.list;

        if (list instanceof Backbone.Collection) {
            list = list.toArray();
        }

        this.props.onSelect(list[index]);
    },

    renderOption(option, index) {
        let props = {
            key: index,
            label: this.props.optionName(option),
            value: index,
        }
        return (
        <option {...props}>
            { props.label }
        </option>
        );
    },

    render() {
        let { current, list } = this.props;

        if (!(list && current)) {
            return (
            <select className="form-control">
                <option label="Loading...">
                    Loading...
                </option>
            </select>
            );
        }

        if (list instanceof Backbone.Collection) {
            list = list.toArray();
        }

        let value;
        if (this.props.findIndex) {
            value = list.findIndex(this.props.findIndex);
        } else {
            value = list.indexOf(current);
        }

        if (value == -1) {
            console.warn(
                "The element to display doesn't exist in the list of available elements"
            );
            console.trace();
        }

        return (
        <select value={ value } className='form-control' onChange={ this.onSelect }>
            { list.map(this.renderOption) }
        </select>
        );
    }
});
