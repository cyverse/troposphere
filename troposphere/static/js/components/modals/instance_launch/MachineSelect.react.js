/** @jsx React.DOM */

define(
  [
    'react',
    'components/mixins/modal',
    'actions/SizeActions',
    'stores/SizeStore'
  ],
  function (React, ModalMixin, SizeActions, SizeStore) {

    return React.createClass({

      propTypes: {
        machineId: React.PropTypes.string.isRequired,
        machines: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      render: function () {
        var options = this.props.machines.map(function (machine) {
          return (
            <option value={machine.id}>
              {machine.get('pretty_version')}
            </option>
          );
        });

        return (
          <select value={this.props.machineId} id='machine' className='form-control' onChange={this.props.onChange}>
            {options}
          </select>
        );
      }

    });

  });
