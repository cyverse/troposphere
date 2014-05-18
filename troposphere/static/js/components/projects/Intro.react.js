define(
  [
    'react',
    './DashboardIcon.react'
  ],
  function(React) {

    var items = [
      {
        image: '/assets/images/icon_launchnewinstance.png',
        title: 'Launch New Instance',
        description: 'Browse Atmosphere\'s list of available images and select one to launch a new instance.',
        href: 'app_store'
      },
      {
        image: '/assets/images/icon_gethelp.png',
        title: 'Browse Help Resources',
        description: 'View a video tutorial, read the how-to guides, or email the Atmosphere support team.',
        href: 'help'
      },
      {
        image: '/assets/images/icon_settings.png',
        title: 'Change Your Settings',
        description: 'Modify your account settings, view your resource quota, or request more resources.',
        href: 'settings'
      }
    ];

    return React.createClass({
        render: function() {
          var itemElements = _.map(items, DashboardIcon);

          return (
            <ul id="dashboard-link-list">
              {itemElements}
            </ul>
          );
        }
    });

});
