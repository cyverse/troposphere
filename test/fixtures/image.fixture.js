define(
  [
    'collections/ApplicationCollection',
    'models/Application'
  ], function(ImageCollection, Image) {

    return  new Image({
      id: "5e7ed62c-6c2d-11e4-b116-123b93f75cba",
      uuid: "5e7ed62c-6c2d-11e4-b116-123b93f75cba",
      icon: null,
      created_by: "username",
      name: "Image Name",
      tags: ["tagName"],
      description: "Image Description",
      start_date: "2014-02-04T18:17:18.053Z",
      end_date: null,
      private: false,
      featured: false,
      machines: [
          {
              alias: "550e6440-6c2d-11e4-b116-123b93f75cba",
              version: "1",
              start_date: "2014-02-04T19:09:07.622Z",
              end_date: null,
              provider: 1
          }
      ],
      is_bookmarked: false
    }, {parse: true});

});
