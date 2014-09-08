require(
  [
    'jquery',
    'react',

    // component under test
    'components/Root.react'
  ],
  function ($, React, Root) {

    $(document).ready(function () {
      React.renderComponent(Root({
        route: ["projects"]
      }), document.getElementById('application'));
    });

  });
