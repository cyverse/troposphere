
define(
  [
    'react',
    'backbone'
  ],
  function (React, Backbone) {

    return React.createClass({
      displayName: "InstanceSizeSelect",

      propTypes: {
        sizeId: React.PropTypes.number.isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onChange: React.PropTypes.func.isRequired
      },

      renderOption: function (size) {
        return (
          <option key={size.id} value={size.id}>
            {size.formattedDetails()}
          </option>
        );
      },

      render: function () {
        if (this.props.sizes) {
          var options = this.props.sizes.map(this.renderOption);

          return (
            <select value={this.props.sizeId} className='form-control' id='size' onChange={this.props.onChange}>
              {options}
            </select>
          );
        }

        return (
          <div className="loading-small"></div>
        );
      }
    });

  });
