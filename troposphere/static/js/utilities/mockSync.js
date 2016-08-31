import $ from "jquery";

export default function mockSyncDecorator(fakeData, delay = 50) {
    return function(method, collection, options) {
        let deferred = $.Deferred();
        setTimeout(() => {
            let parsed = this.parse(fakeData);
            collection.reset(parsed.map(item => new collection.model(item)));
            deferred.resolve(collection);
        }, delay);
        return deferred;
    }
}
