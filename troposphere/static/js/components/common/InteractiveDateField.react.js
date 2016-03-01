import React from 'react/addons';
import _ from 'underscore';
import moment from 'moment';
import globals from 'globals';
// plugin: required but not used directly
import bootstrap from 'bootstrap';

export default React.createClass({
    displayName: "InteractiveDateField",

    propTypes: {
      value: React.PropTypes.string,
      labelText: React.PropTypes.string,
      onChange: React.PropTypes.func.isRequired,
    },

    getInitialState: function () {
        return {
            value: this.props.value
        }
    },

    onValueChanged: function (e) {
      this.setState({value: e.target.value});
      if(this.props.onChange != null) {
        this.props.onChange(e.target.value)
      }
    },

    unsetDate: function (e) {
      var newValue = "";
      this.setState({value: newValue});
      if(this.props.onChange != null) {
        this.props.onChange(newValue)
      }
    },

    setEndDateNow: function (e) {
      var now_time = moment(new Date()),
        new_value = now_time.tz(globals.TZ_REGION).format("M/DD/YYYY hh:mm a z");
      this.setState({value: new_value});
      if(this.props.onChange != null) {
        this.props.onChange(new_value)
      }
    },

    render: function () {
      var labelEl = this.props.labelText ? (<label htmlFor="interactive-date-field">{this.props.labelText}</label>) : null;
      var btnStyle = {
        lineHeight: '1.31' // I know this is quite heinous ...
      };
      var lastBtnStyle = {
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px'
      };
      _.extend(lastBtnStyle, btnStyle);

      return (
        <div>
        {labelEl}
        <div className="input-group">
          <input id="interactive-date-field"
            type="text"
            className="form-control"
            value={this.state.value}
            onChange={this.onValueChanged} />
          <div className="input-group-btn">
            <button type="button"
                id="enddate-set-addon"
                className="btn btn-default"
                style={btnStyle}
                onClick={this.setEndDateNow}>Today</button>
            <button type="button"
                id="enddate-clear-addon"
                className="btn btn-default"
                style={lastBtnStyle}
                onClick={this.unsetDate}>Clear</button>
          </div>
        </div>
        </div>
      );
    }
});
