/** @jsx React.DOM */

define(
  [
    'react',
    'underscore',
    'controllers/volumes'
  ],
  function (React, _, VolumeController) {

    return React.createClass({

      propTypes: {
        volume: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      getInitialState: function () {
        return {
          instance: this.props.instances ? this.props.instances.at(0) : null
        };
      },

      componentWillReceiveProps: function (newProps) {
        var instances = newProps.instances;
        if (instances && instances.length) {
          this.setState({instance: instances.at(0)});
        }
      },

      handleSubmit: function (e) {
        e.preventDefault();
        var volume = this.props.volume;
        VolumeController.attach(this.props.volume, this.state.instance);
      },

      handleChange: function (e) {
        var instance = this.props.instances.get(e.target.value);
        this.setState({instance: instance});
      },

      getInstanceSelect: function () {
        var options = [];
        var attaching = this.props.volume.get('status') == 'attaching';

        if (this.props.instances){
          options = this.props.instances.map(function (instance) {
            return (
              <option value={instance.id}>
                {instance.get('name_or_id')}
              </option>
            );
          });
        }

        return (
          <select className='form-control'
                  disabled={attaching}
                  onChange={this.handleChange}
                  value={this.state.instance ? this.state.instance.id : null}
          >
            {options}
          </select>
        );
      },

      getAttachButton: function () {
        var attaching = this.props.volume.get('status') == 'attaching';
        var content = attaching ? "Attaching..." : "Attach";
        var className = 'btn btn-primary btn-block';
        var disabled;

        if (attaching || !this.state.instance) {
          className += ' disabled';
          disabled = 'disabled';
        }

        return (
          <button className={className} disabled={disabled}>
            {content}
          </button>
        );
      },

      render: function () {
        return (
          <form onSubmit={this.handleSubmit}>
            <div className='container-fluid'>
              <div className='row'>
                <div className='col-xs-9'>
                  {this.getInstanceSelect()}
                </div>
                <div className='col-xs-3'>
                  {this.getAttachButton()}
                </div>
              </div>
            </div>
          </form>
        );
      }
    });

  });
