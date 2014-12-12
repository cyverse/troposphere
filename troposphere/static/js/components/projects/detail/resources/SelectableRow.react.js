/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './Checkbox.react'
  ],
  function (React, Backbone, Checkbox) {

    return React.createClass({

      propTypes: {
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        onPreviewResource: React.PropTypes.func.isRequired,
        isActive: React.PropTypes.bool,
        isSelected: React.PropTypes.bool,
        children: React.PropTypes.node.isRequired,
        resource: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      toggleCheckbox: function(e){
        if(this.props.isSelected){
          this.props.onResourceDeselected(this.props.resource);
        }else{
          this.props.onResourceSelected(this.props.resource);
        }
      },

      previewResource: function(e){
        if(this.props.onPreviewResource){
          this.props.onPreviewResource(this.props.resource);
        }
      },

      render: function () {
        var rowClassName = this.props.isActive ? "selected" : null;

        return (
          <tr className={rowClassName} onClick={this.previewResource}>
            <td>
              <Checkbox isChecked={this.props.isSelected} onToggleChecked={this.toggleCheckbox}/>
            </td>
            {this.props.children}
          </tr>
        );
      }

    });

  });
