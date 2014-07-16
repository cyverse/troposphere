/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    './InstanceRow.react',
    './InstanceNotRealRow.react',
    './Checkbox.react',
    './SelectableTable.react'
  ],
  function (React, Backbone, InstanceRow, InstanceNotRealRow, Checkbox, SelectableTable) {

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

      getInstanceRows: function(){
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
        return instanceRows;
      },

      render: function () {
//        var instanceRows = this.props.instances.map(function(instance){
//          var isPreviewed = (this.props.previewedResource === instance);
//          var isChecked = this.props.selectedResources.get(instance) ? true : false;
//          if(instance.isRealInstance) {
//            return (
//              <InstanceRow key={instance.id}
//                           instance={instance}
//                           project={this.props.project}
//                           onResourceSelected={this.props.onResourceSelected}
//                           onResourceDeselected={this.props.onResourceDeselected}
//                           providers={this.props.providers}
//                           isPreviewed={isPreviewed}
//                           isChecked={isChecked}
//              />
//            );
//          }else{
//            return (
//              <InstanceNotRealRow key={instance.id}
//                                  instance={instance}
//                                  project={this.props.project}
//              />
//            );
//          }
//        }.bind(this));

//        var instanceRows = this.props.getResourceRows();

//        return (
//          <table className="table table-hover">
//            <thead>
//              <tr>
//                <th><Checkbox isChecked={this.areAllInstancesSelected()} onToggleChecked={this.toggleCheckbox}/></th>
//                <th>Name</th>
//                <th>Status</th>
//                <th>IP Address</th>
//                <th>Size</th>
//                <th>Provider</th>
//              </tr>
//            </thead>
//            <tbody>
//              {instanceRows}
//            </tbody>
//          </table>
//        );

        return (
          <SelectableTable resources={this.props.instances}
                           selectedResources={this.props.selectedResources}
                           getResourceRows={this.getInstanceRows}
                           onResourceSelected={this.props.onResourceSelected}
                           onResourceDeselected={this.props.onResourceDeselected}
          >
            <th>Name</th>
            <th>Status</th>
            <th>IP Address</th>
            <th>Size</th>
            <th>Provider</th>
          </SelectableTable>
        )
      }

    });

  });
