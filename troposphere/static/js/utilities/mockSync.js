import $ from 'jquery';

export default function mockSyncDecorator(fakeData) {
    return function(method, collection, options) {
        let deferred = $.Deferred();
        setTimeout(() => {
            collection.reset(fakeData.map(item => new collection.model(item)));
            deferred.resolve(collection);
        }, 50);
        return deferred;
    }
}
