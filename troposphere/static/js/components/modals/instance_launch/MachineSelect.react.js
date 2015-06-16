/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/mixins/modal'
  ],
  function (React, Backbone, ModalMixin) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        machines: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var options = this.props.machines.map(function (machine) {
          return (
            <option key={machine.id} value={machine.id}>
              {machine.get('version')}
            </option>
          );
        });

        return (
          <select value={this.props.machine.version} id='machine' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>

        );
      }

    });

  });
