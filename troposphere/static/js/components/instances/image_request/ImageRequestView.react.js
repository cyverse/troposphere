/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
  ],
  function (React, PageHeader, InstanceAttributes, InstanceLinks, ActionList) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired
      },

      render: function () {
        var instance = this.props.instance,
            provider = this.props.provider;

        var helpText = function(){
          return (
            <p>
              Please read the
              <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">wiki page about requesting an image of your instance</a>
              before completing the form below.
            </p>
          );
        }

        return (
          <div className="imaging_form module">
            <PageHeader title="Request Imaging" helpText={helpText}/>

            <form className="request_imaging_form form-horizontal" method="post">

            </form>

          </div>
          );
      }

    });

  });
