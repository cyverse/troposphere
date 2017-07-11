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

*/
export default React.createClass({
    displayName: "SelectMenu",

    propTypes: {
        onSelect: React.PropTypes.func.isRequired,
        optionName: React.PropTypes.func,
        renderListOption: React.PropTypes.func,
        list: React.PropTypes.oneOfType([
            React.PropTypes.instanceOf(Backbone.Collection),
            React.PropTypes.array
        ]),
        hintText: React.PropTypes.string,
        className: React.PropTypes.string,
        current: React.PropTypes.object,
        placeholder: React.PropTypes.string,
    },

    getDefaultProps: function() {
        return {
            hintText: "",
            className: "form-control"
        }
    },

    getInitialState() {
        if(
            (!this.props.optionName && !this.props.renderListOption) ||
            (this.props.optionName && this.props.renderListOption) ) {
            console.warn("SelectMenu requires optionName _or_ renderListOption")
        }
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
            list = list.slice()
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
                options.push(this.renderPlaceholderOption(placeholder || this.props.hintText))
            }

            let renderOptions = this.props.renderListOption;
            let newOptions = [];
            if(!renderOptions) {
                /* Default Behavior:
                * optionName(elem) -> name,
                *        renderOption(name) -> option
                */
                newOptions = list.map(this.props.optionName).map(this.renderListOption);
            } else {
                /* Override Behavior:
                * this.props.renderListOption(elem) -> option
                */
                newOptions = list.map(renderOptions);
            }
            // Append options from the list
            options = options.concat(newOptions);

            index = list.indexOf(current);
            if (current != null && index == -1) {
                console.warn(
                    "SelectMenu: The element to display ("+current+") doesn't exist in the list of available elements"
                );
                console.log(current)
            }
        }

        return (
        <select value={index} className={this.props.className} onChange={this.onSelect}>
            {options}
        </select>
        );
    }
});
