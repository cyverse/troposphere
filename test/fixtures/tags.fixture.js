define(
  [
    'collections/TagCollection',
    'models/Tag'
  ], function(TagCollection, Tag) {

    var tag1 =  new Tag({
      id: 1,
      name: "tagName",
      description: "Description of tag."
    }, {parse: true});

    return new TagCollection([tag1]);

});
