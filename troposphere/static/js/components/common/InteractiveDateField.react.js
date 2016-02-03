define(function (require) {

  var React = require('react/addons'),
    _ = require('underscore'),
      moment = require('moment'),
      globals = require('globals'),
  // plugin: required but not used directly
    bootstrap = require('bootstrap');

  return React.createClass({
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
      var new_value = "";
      this.setState({value: new_value});
      if(this.props.onChange != null) {
        this.props.onChange(new_value)
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
      var labelEl = this.props.labelText ? (<label>{this.props.labelText}</label>) : "";
      var style = {};
      style.button = {cursor: "pointer"};
      return (
            <div className="form-group">
                    <label htmlFor="date-field">{labelEl}</label>
                <div className="input-group">
                    {/* The div below serves as a button, it is not an actual button because bootstrap directly styles button elements within form groups */}
                    <div className="input-group-addon" 
                        id="enddate-set-addon" 
                        onClick={this.setEndDateNow}
                        style={style.button}
                    >
                        Today
                    </div>
                    <input id="date-field" type='text' className='form-control' value={this.state.value} onChange={this.onValueChanged}/>
                    { /* Button, again bootstrap */ }
                    <div className="input-group-addon" 
                        id="enddate-clear-addon" 
                        onClick={this.unsetDate}
                        style={style.button}
                    >
                        Clear
                    </div>
                </div>
            </div>
      );
    }
  });

});
