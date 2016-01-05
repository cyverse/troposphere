import React from 'react';
import backbone from 'backbone';
import _ from 'underscore';

export default React.createClass({
    displayName: "SelectMenu",

    propTypes: {
        defaultId: React.PropTypes.number.isRequired,
        isModel: React.PropTypes.bool,
        optionName: React.PropTypes.func.isRequired
    },

    getInitialState: function(){
        let defaultId = this.props.defaultId;

        return({
            value: defaultId
        })
    },

    onSelectChange: function(e) {
        let val = e.target.value;
        let list = this.props.list
        let obj = list.get(val);

        this.props.onSelectChange(obj);
        this.setState({value: val});
    },

    hintText: function() {
        if (this.props.hintText) {
            return (
            <option value="" disabled selected hidden>{this.props.hintText}</option>
            );
        }
    },

    renderOption: function (item) {
            return (
                <option key={item.id} value={item.id}>
                    {this.props.optionName(item)}
                </option>
            );
    },

    render: function () {
        if (this.props.list) {
            let options = this.props.list.map(this.renderOption);
            
            return (
            <select value={this.state.value} className='form-control' id='size' onChange={this.onSelectChange}>
                {this.hintText()}
                {options}
            </select>
            );
        }

        return (
            <div className="loading-small"></div>
        );
    }
});

