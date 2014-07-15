/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react',
    './InstanceNotRealRow.react',
    './Checkbox.react'
  ],
  function (React, Backbone, InstanceRow, InstanceNotRealRow, Checkbox) {

    return React.createClass({

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        instances: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        onResourceSelected: React.PropTypes.func.isRequired,
        onResourceDeselected: React.PropTypes.func.isRequired,
        providers: React.PropTypes.instanceOf(Backbone.Collection).isRequired,
        previewedResource: React.PropTypes.instanceOf(Backbone.Model),
        selectedResources: React.PropTypes.instanceOf(Backbone.Collection)
      },

      getInitialState: function(){
        return {
          isChecked: false
        }
      },

      toggleCheckbox: function(e){
        var isChecked = !this.state.isChecked;
        this.setState({isChecked: isChecked});

        this.props.instances.each(function(instance){
          if(isChecked){
            this.props.onResourceSelected(instance);
          }else{
            this.props.onResourceDeselected(instance);
          }
        }.bind(this));
      },

      render: function () {
        var instanceRows = this.props.instances.map(function(instance){
          var isPreviewed = (this.props.previewedResource === instance);
          var isChecked = this.props.selectedResources.get(instance) ? true : false;
          if(instance.isRealInstance) {
            return (
              <InstanceRow key={instance.id}
                           instance={instance}
                           project={this.props.project}
                           onResourceSelected={this.props.onResourceSelected}
                           onResourceDeselected={this.props.onResourceDeselected}
                           providers={this.props.providers}
                           isPreviewed={isPreviewed}
                           isChecked={isChecked}
              />
            );
          }else{
            return (
              <InstanceNotRealRow key={instance.id}
                                  instance={instance}
                                  project={this.props.project}
              />
            );
          }
        }.bind(this));

        return (
          <table className="table table-hover">
            <thead>
              <tr>
                <th><Checkbox isChecked={this.state.isChecked} onToggleChecked={this.toggleCheckbox}/></th>
                <th>Name</th>
                <th>Status</th>
                <th>IP Address</th>
                <th>Size</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {instanceRows}
            </tbody>
          </table>
        );
      }

    });

  });
