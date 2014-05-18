/** @jsx React.DOM */

define(
  [
    'react',
    'components/PageHeader.react'
  ],
  function (React, PageHeader) {

    return React.createClass({

      render: function () {
        var providers = this.props.providers;
        var items = providers.map(function (model) {
          return [
            <h2>{model.get('location')}</h2>,
            <p>{model.get('description')}</p>
          ];
        });

        return (
          <div>
            <PageHeader title="Cloud Providers"/>
            {items}
          </div>
        );
      }

    });

  });
