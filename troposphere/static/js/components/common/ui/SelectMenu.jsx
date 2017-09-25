import React from "react";
import Backbone from "backbone";

/*
Here is the interface of `SelectMenu`:

    <SelectMenu
       current={ The element to display }
       optionName = { A function mapping an element to a name }
       list={ The list of elements }
       onSelect={ The function to call on element selection } \>

The select menu may also support placeholder text, when current is null.

    <SelectMenu
       placeholder={ Text to display if current is null }
       ...  \>

The select menu may also render disabled.

    <SelectMenu
       disabled=true
       ...  \>

*/
export default React.createClass({
    displayName: "SelectMenu",

    propTypes: {
        onSelect: React.PropTypes.func.isRequired,
        optionName: React.PropTypes.func.isRequired,
        list: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Backbone.Collection),
            React.PropTypes.array
        ]),
        disabled: React.PropTypes.bool,
        current: React.PropTypes.object,
        placeholder: React.PropTypes.string,
    },

    getDefaultProps() {
        return {
            disabled: false,
            current: null,
            placeholder: null
        }
    },

    getInitialState() {
        return this.getStateFromProps(this.props);
    },

    componentWillReceiveProps(props) {
        this.setState(this.getStateFromProps(props));
    },

    getStateFromProps(props) {
        let list = props.list;

        // Despite allowing a collections or array, internally we use an array
        if (list instanceof Backbone.Collection) {
            list = list.toArray();
        } else if (list) {
            list = list.slice();
        } else {
            list = [];
        }

        return {
            list,
        }
    },

    onSelect(e) {
        let index = Number(e.target.value);
        let list = this.state.list;

        this.props.onSelect(list[index]);
    },

    optionProps(label, index) {
        return {
            label,
            key: index,
            value: index,
        }
    },

    renderOption(props) {
        return (
        <option {...props}>
            {props.label}
        </option>
        );
    },

    renderPlaceholderOption(label) {
        let props = {
            // Note: this value of -1 is how we identify the placeholder
            ...this.optionProps(label, -1),
            disabled: true,
            hidden: true
        };
        return this.renderOption(props);
    },

    renderListOption(label, index) {
        let props = this.optionProps(label, index);
        return this.renderOption(props);
    },

    render() {
        let { current, placeholder } = this.props;
        let { list } = this.state;

        // The select menu's options
        let options = [];

        // The option to display, -1 is the placeholder/null option
        let index = -1;

        if (!list) {
            options.push(this.renderPlaceholderOption("Loading..."));
        } else {

            // If the current element to display is null, we render a
            // placeholder option, it can be blank or have some placeholder
            // text
            if (current == null) {
                options.push(this.renderPlaceholderOption(placeholder || ""))
            }

            // Append options from the list
            options = options.concat(
                // optionName(elem) -> name,
                //        renderOption(name) -> option
                list.map(this.props.optionName)
                    .map(this.renderListOption)
            )

            index = list.indexOf(current);
            if (current != null && index == -1) {
                console.warn(
                    `SelectMenu: The element to display: "${current}" doesn't`,
                    "exist in the list of available elements"
                );
            }
        }

        return (
        <select
            disabled={this.props.disabled}
            value={index}
            className="form-control"
            onChange={this.onSelect}>
            {options}
        </select>
        );
    }
});
