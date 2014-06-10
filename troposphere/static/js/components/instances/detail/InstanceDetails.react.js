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
        var detailArray = [
          {label: 'Status', value: 'Active'},
          {label: 'IP Address', value: '128.196.64.25'},
          {label: 'Launched', value: 'May 21, 2014 (9 days ago)'},
          {label: 'Based On', value: 'iPlant Base Image v3.0'},
          {label: 'Identity', value: '7 on iPlant Cloud-Tucson'},
          {label: 'ID', value: 'b94d4964-8de3-4965-a87a-f4cf44d33165'}
        ];

        var statusLight = <span className="instance-status-light"></span>

        var details = detailArray.map(function(detail){
          return (
            <li>
              <span className="instance-detail-label">{detail.label}</span>
              {detail.label === "Status" ? statusLight : null}
              <span className="instance-detail-value">{detail.value}</span>
            </li>
          );
        });

        return (
          <div className="instance-details-section">
            <h4>Instance Details</h4>
            <ul>
              {details}
            </ul>
          </div>
        );
      }

    });

  });
