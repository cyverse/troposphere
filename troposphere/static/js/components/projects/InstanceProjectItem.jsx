define(
  [
    'react',
    'url',
    './ProjectItemMixin'
  ],
  function (React, URL, ProjectItemMixin) {

    return React.createClass({
      mixins: [ProjectItemMixin],

      getClassName: function () {
        return 'instance';
      },

      renderName: function () {
        var instance = this.props.model;
        var href = URL.instance(instance, {absolute: true});
        var navigateOnClick = function (e) {
          e.preventDefault();
          Backbone.history.navigate(URL.instance(instance), {trigger: true});
        };

        return (
          <a href={href} onClick={navigateOnClick}>
            {this.props.model.get('name_or_id')}
          </a>
        );
      },

      renderDetails: function () {
        var machine_name = this.props.model.get('machine_name') || this.props.model.get('machine_alias');
        var ip = this.props.model.get('public_ip_address');
        return [
          ip ? ip + ', ' : '',
          'from ',
          <a>{machine_name}</a>
        ];
      }

    });

  });
