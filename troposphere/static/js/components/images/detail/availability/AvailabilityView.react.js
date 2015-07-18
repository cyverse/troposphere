define(function (require) {

    var _ = require('underscore'),
        React = require('react'),
        Backbone = require('backbone'),
        stores = require('stores'),
        ProviderCollection = require('collections/ProviderCollection');

    return React.createClass({

        propTypes: {
            image: React.PropTypes.instanceOf(Backbone.Model).isRequired
        },

        renderProvider: function (provider) {
          //TODO: 'getProviders' is returning identities?
            return (
                <li key={provider.get('provider').id}>
          {provider.get('provider').name}
                </li>
            )
        },
        render: function () {
            var image = this.props.image,
            providers = this.getProvidersForImage(image);

            if (!providers) {
                return <div className="loading" />
            }

            return (
                <div className='image-availability image-info-segment row'>
                    <h4 className="title col-md-2">Available on</h4>
                    <div className="content col-md-10">
                        <ul className="list-unstyled">
                          {providers.map(this.renderProvider)}
                        </ul>
                    </div>
                </div>
            );
        },
        getProvidersForImage: function(image) {
            return image.getProviders();
        }

    });

});
