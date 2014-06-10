/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    './InstanceAttributes.react',
    './InstanceLinks.react',
    './ActionList.react',
    'backbone'
  ],
  function (React, PageHeader, InstanceAttributes, InstanceLinks, ActionList, Backbone) {

    return React.createClass({

      render: function () {
        return (
          <div>
            <a className='nav-back btn btn-default'>
              <span className='glyphicon glyphicon-arrow-left'>{''}</span>
            </a>
            <h1>Instances</h1>
          </div>
        );
      }

    });

  });
