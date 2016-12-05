// 'react',
// 'backbone',
// '',
// 'test/fixtures/projects.fixture'
// ], function(React, Backbone, ProjectListHeader, projectCollectionFixture) {



var TestUtils = require("react-addons-test-utils"),
    projectListHeader = require("components/projects/common/ProjectListHeader"),
    projectCollectionFixture = require("./test/fixtures/projects.fixture"),
    title;

describe("Project List Header", function() {

    beforeEach(function() {
        title = projectCollectionFixture.length + " Projects";
        var header = ProjectListHeader({
            title: title
        });
        projectListHeader = TestUtils.renderIntoDocument(header);
    });

    it("should display the provided title", function() {
        var h1 = TestUtils.findRenderedDOMComponentWithTag(projectListHeader, "h1");
        var node = h1.getDOMNode();
        expect(node.textContent).toBe(title);
    });


});

// });
