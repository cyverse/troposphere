import React from 'react/addons';
import modernizrTest from 'components/modals/unsupported/modernizrTest.js';

export default React.createClass({
    displayName: "BreakingFeatureList",
    render: function () {
        var listItem = modernizrTest.breakingFeatures.map(function (feature) {
            return (
                <li className="feature" key={feature.id} >
                    <span className="glyphicon glyphicon-alert"> </span>
                    {feature}
                </li>
            )
        });

        return (
            <ul className="BreakingFeatureList" >
                {listItem}
            </ul>
        )
    }
});
