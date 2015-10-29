import React from 'react';
import Backbone from 'backbone';
import modals from 'modals';


export default React.createClass({
      displayName: "SubMenu",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onCreateVolume: function (e) {
        e.preventDefault();
        modals.VolumeModals.createAndAddToProject({project: this.props.project});
      },

      onCreateInstance: function (e) {
        e.preventDefault();
        modals.InstanceModals.createAndAddToProject({project: this.props.project});
      },

      render: function () {
        var scrollSpy = (
          <ul>
            <li className="active"><a href="#">Instances</a></li>
            <li><a href="#">Volumes</a></li>
          </ul>
        );

        return (
          <div className="sub-menu">
            <div className="dropdown">
              <button className="btn btn-primary dropdown-toggle" data-toggle="dropdown">New</button>
              <ul className="dropdown-menu">
                <li>
                  <a href="#" onClick={this.onCreateInstance}>
                    <i className={'glyphicon glyphicon-tasks'}/>
                    Instance
                  </a>
                </li>
                <li>
                  <a href="#" onClick={this.onCreateVolume}>
                    <i className={'glyphicon glyphicon-hdd'}/>
                    Volume
                  </a>
                </li>
              </ul>
            </div>
            {false ? scrollSpy : null}
         </div>
        );
      }
});
