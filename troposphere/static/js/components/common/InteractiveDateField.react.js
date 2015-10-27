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

      return (
      <div className='image-info-segment row'>
        <h4 className="titel col-md-2">Date to hide image from public view</h4>
        <div className="form-group col-md-10">
          <input type='text' className='form-control' value={this.state.value} onChange={this.onValueChanged}/>
          <span className="input-group-addon" id="enddate-set-addon" onClick={this.setEndDateNow}>Set</span>
          <span className="input-group-addon" id="enddate-clear-addon" onClick={this.unsetDate}>Clear</span>
        </div>
      </div>
      );
    }
  });

});
