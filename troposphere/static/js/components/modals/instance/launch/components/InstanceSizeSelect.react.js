
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
        var disabled = this.props.min_cpu != null && this.props.min_mem != null && (size.get('cpu') < this.props.min_cpu || size.get('mem') < this.props.min_mem / 1024);
        var text = size.formattedDetails();
        if(disabled){
          text += " Unavailable: fails minimum requirements";
        }
        return (
          <option disabled={disabled} key={size.id} value={size.id}>
            {text}
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
