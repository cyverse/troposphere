define(function (require) {
    var React = require('react/addons'),
    modernizrTest = require('components/modals/unsupported/modernizrTest.js');

    return React.createClass({
      displayName: "BreakingFeatureList",
       render: function () {
            var listItem = modernizrTest.breakingFeatures.map(function (feature) {
                return (
                <li className="feature" key={feature.id} ><span className="glyphicon glyphicon-alert"> </span> {feature}</li>
                )
            });
        
            return (
                <ul className="BreakingFeatureList" >
                {listItem}
                </ul>
            )
        }
    });
});
