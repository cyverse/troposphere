/** @jsx React.DOM */

define(
  [
    'react',
    'backbone',
    'components/common/Time.react',
    'components/common/Gravatar.react',
    'crypto',
    'stores'
  ],
  function (React, Backbone, Time, Gravatar, CryptoJS, stores) {

    return React.createClass({

      propTypes: {
        machine: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var machine = this.props.machine;

        // If the machine doesn't exist, don't render anything.  This happens for some
        // instances but should probably be looked into on the server side
        // https://pods.iplantcollaborative.org/jira/browse/ATMO-660
        // todo: even when I hide this, there are still two options that show up in the
        // launch modal for versions.  I think this is fundamentally broken and needs to
        // be re-examined on the server side.
        //if(!machine.id) {
        //  return (
        //    <div></div>
        //  )
        //}

        // todo: figure out if anything is ever recommended, or if it's just a concept idea
        var isRecommended = false;
        var dateCreated = machine.get('start_date').format("M/DD/YYYY");

        var machineHash = CryptoJS.MD5(machine.id).toString();
        var iconSize = 63;
        var type = stores.ProfileStore.get().get('icon_set');

        return (
          <li>
            <div>
              <Gravatar hash={machineHash} size={iconSize} type={type}/>
              <div className="image-version-details">
                <div className="version">
                  {machine.get('pretty_version')}
                  {isRecommended ? <span className="recommended-tag">Recommended</span> : null}
                </div>
                <div>{dateCreated}</div>
                <div>{machine.get('ownerid')}</div>
              </div>
            </div>
          </li>
        );
      }

    });

  });
