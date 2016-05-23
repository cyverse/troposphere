import React from 'react/addons';
import Moment from 'moment';

export default React.createClass({
    displayName: "Time",

    propTypes: {
      date: React.PropTypes.instanceOf(Date),
      showAbsolute: React.PropTypes.bool,
      showRelative: React.PropTypes.bool
    },

    getDefaultProps: function () {
      return {
        showAbsolute: true,
        showRelative: true
      };
    },

    render: function () {
      var title = Moment(this.props.date).format(),
        dateTime = Moment(this.props.date).utc().format(),
        text = "",
        moment = Moment(this.props.date),
        absoluteText = moment.format("MMM D, YYYY"),
        relativeText = moment.fromNow();

      if (this.props.showAbsolute) {
        text += absoluteText;
        if (this.props.showRelative)
          text += " (" + relativeText + ")";
      } else if (this.props.showRelative) {
        text += relativeText;
      }

      return (
        <time title={title} dateTime={dateTime}>
          {text}
        </time>
      );
    }

  });
