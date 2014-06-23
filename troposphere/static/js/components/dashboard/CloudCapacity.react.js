/** @jsx React.DOM */

define(
  [
    'react'
  ],
  function (React) {

    return React.createClass({

      propTypes: {
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        sizes: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      render: function () {
        /*
         Display of Cloud capacity. Especially making it clear ~ "this one is
         almost full, launching larger instance sizes may not be possible."
         */

        var style = {
          "margin-left": "40px"
        };

        var sizeHeaders = this.props.sizes.map(function(size){
          return (
            <th key={size.get('alias')}>{size.get('name')}</th>
          );
        });

        var sizeData = this.props.sizes.map(function(size){
          var hasCapacity = size.get('remaining') > 0;
          return (
            <td key={size.get('alias')} className={hasCapacity ? "bg-success" : "bg-danger"}>{size.get('remaining')}</td>
          );
        });

        return (
          <div className="" style={style}>
            <h3>{this.props.provider.get('location')}</h3>
            <table className="table table-condensed">
              <thead>
                <tr>
                  {sizeHeaders}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {sizeData}
                </tr>
              </tbody>
            </table>
          </div>
        );
      }

    });

  });
