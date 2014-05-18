define(
  [
    'react',
    'components/common/time',
    'url',
    './ProjectItemMixin'
  ],
  function (React, Time, URL, ProjectItemMixin) {

    return React.createClass({
      mixins: [ProjectItemMixin],

      getClassName: function () {
        return 'volume';
      },

      renderName: function () {
        var volume = this.props.model;
        var href = URL.volume(volume, {absolute: true});
        var onClick = function (e) {
          e.preventDefault();
          Backbone.history.navigate(URL.volume(volume), {trigger: true});
        };

        return (
          <a href={href} onClick={onClick}>
            {volume.get('name_or_id')}
          </a>
        );
      },

      renderDetails: function () {
        return [
          this.props.model.get('size') + ' GB, created ',
          <Time date={this.props.model.get('start_date')}/>
        ];
      }

    });

  });
