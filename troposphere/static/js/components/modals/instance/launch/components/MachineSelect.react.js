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
        var machine_name;
        if (this.props.machine) {
          machine_name = this.props.machine.get('name')
        } else {
          machine_name = ""
        }
        var options = this.props.machines.map(function (machine) {
          return (
            <option key={machine.id} value={machine.id}>
              {machine.get('name')}
            </option>
          );
        });

        return (
          <select value={machine_name} id='machine' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>

        );
      }

    });

  });
