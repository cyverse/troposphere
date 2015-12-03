
define(
  [
    'react',
    'backbone',
    'modals'
  ],
  function (React, Backbone, modals) {

    return React.createClass({
      displayName: "SubMenu",

      propTypes: {
        project: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      onCreateExternalLink: function (e) {
        e.preventDefault();
        //TODO: Add initial_text if that makes sense.
        var initial_text = "";
        modals.ExternalLinkModals.createAndAddToProject(initial_text, this.props.project);
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
            <li><a href="#">Links</a></li>
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
                <li>
                  <a href="#" onClick={this.onCreateExternalLink}>
                    <i className={'glyphicon glyphicon-text-background'}/>
                    Link
                  </a>
                </li>
              </ul>
            </div>
            {false ? scrollSpy : null}
         </div>
        );
      }

    });

  });
