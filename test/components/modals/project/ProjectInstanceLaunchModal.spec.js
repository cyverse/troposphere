define(
  [
    'react',
    'components/modals/project/ProjectInstanceLaunchModal.react',
    'test/fixtures/images.fixture',
    'stores',
    'components/modals/project/instance_launch/ImageList.react',
    'test/fixtures/image.fixture',
    'components/modals/project/instance_launch/ImageDetailsView.react',
    'components/modals/project/instance_launch/ImageLaunchView.react'
  ], function(React, ProjectInstanceLaunchModal, imageCollectionFixture, stores, ImageList, imageFixture, ImageDetailsView, ImageLaunchView) {

    var TestUtils,
        modalElement;

    describe('Project Instance Launch Modal', function() {

      beforeEach(function() {
        TestUtils = React.addons.TestUtils;

        for(var store in stores) delete stores[store];

        stores.ApplicationStore = {
          getAll: function(){},
          addChangeListener: function(){},
          removeChangeListener: function(){}
        };
      });

      describe("image list view", function(){

        beforeEach(function() {
          var factory = React.createFactory(ProjectInstanceLaunchModal);
          var modal = factory();
          modalElement = TestUtils.renderIntoDocument(modal);
        });

        it("should have a search bar", function(){
          var input = TestUtils.findRenderedDOMComponentWithTag(modalElement, "input");
          expect(input).toBeDefined();
        });

        describe("with no images", function(){

          beforeEach(function(){
            stores.ApplicationStore.getAll = function(){
              return null;
            }
          });

          it("should display a loading animation", function(){
            var elements = TestUtils.scryRenderedDOMComponentsWithClass(modalElement, "loading");
            expect(elements.length).toBe(1);
          });

        });

        describe("with images", function(){

          beforeEach(function(){
            stores.ApplicationStore.getAll = function(){
              return imageCollectionFixture;
            };

            var modal = ProjectInstanceLaunchModal();
            modalElement = TestUtils.renderIntoDocument(modal);
          });

          it("should not display a loading animation", function(){
            var elements = TestUtils.scryRenderedDOMComponentsWithClass(modalElement, "loading");
            expect(elements.length).toBe(0);
          });

          it("should display a list of search results", function(){
            var liElements = TestUtils.scryRenderedDOMComponentsWithTag(modalElement, "li");
            expect(liElements.length).toBe(imageCollectionFixture.length);
          });

          it("should display a list of search results", function(){
            var results = TestUtils.scryRenderedComponentsWithType(modalElement, ImageList);
            expect(results.length).toBe(1);
          });

          it("should tell the user there is no filter criteria", function(){
            var liElements = TestUtils.findRenderedDOMComponentWithClass(modalElement, "filter-description");
            expect(liElements.getDOMNode().textContent).toBe('Showing all images');
          });

          describe("when user enters search term", function(){
            var searchTerm;

            beforeEach(function(){
              searchTerm = "Image2";

              stores.ApplicationStore.getSearchResultsFor = function(){
                return imageCollectionFixture.slice(1);
              };

              var input = TestUtils.findRenderedDOMComponentWithTag(modalElement, "input");
              TestUtils.Simulate.change(input, {target: {value: searchTerm}});
              TestUtils.Simulate.keyUp(input, {keyCode: 13});
            });

            it("should filter search results when user enters a search term", function(){
              var liElements = TestUtils.scryRenderedDOMComponentsWithTag(modalElement, "li");
              expect(liElements.length).toBe(1);
            });

            it("should tell the user what they searched for", function(){
              var liElements = TestUtils.findRenderedDOMComponentWithClass(modalElement, "filter-description");
              expect(liElements.getDOMNode().textContent).toBe('Showing results for "' + searchTerm + '"');
            });

          });

          describe("when user clicks on an image", function(){

            beforeEach(function(){
              modalElement.showImageDetails(imageFixture);
            });

            it("should not show the search bar", function(){
              var results = TestUtils.scryRenderedDOMComponentsWithClass(modalElement, "search-bar");
              expect(results.length).toBe(0);
            })

          });

          describe("footer", function(){
            it("should contain a cancel button", function(){
              TestUtils.findRenderedDOMComponentWithClass(modalElement, "cancel-button");
            })
          })

        });

      });

      describe("image details view", function(){

        beforeEach(function() {
          var factory = React.createFactory(ProjectInstanceLaunchModal);
          var modal = factory();
          modalElement = TestUtils.renderIntoDocument(modal);
          modalElement.showImageDetails(imageFixture);
        });

        it("should display the image details view", function(){
          var results = TestUtils.scryRenderedComponentsWithType(modalElement, ImageDetailsView);
          expect(results.length).toBe(1);
        });

        ddescribe("footer", function(){

          it("should contain a search button", function(){
            TestUtils.findRenderedDOMComponentWithClass(modalElement, "search-button");
          });

          it("should contain a configure button", function(){
            TestUtils.findRenderedDOMComponentWithClass(modalElement, "configure-button");
          });

          describe("when user clicks on search button", function(){
            it("should navigate back to the image list view", function(){
              var searchButton = TestUtils.findRenderedDOMComponentWithClass(modalElement, "search-button");
              TestUtils.Simulate.click(searchButton.getDOMNode());
              var elements = TestUtils.scryRenderedDOMComponentsWithTag(modalElement, "input");
              expect(elements.length).toBe(1);
            })
          });

          describe("when user clicks on configure button", function(){
            it("should navigate back to the image launch view", function(){
              var searchButton = TestUtils.findRenderedDOMComponentWithClass(modalElement, "configure-button");
              TestUtils.Simulate.click(searchButton.getDOMNode());
              var results = TestUtils.scryRenderedComponentsWithType(modalElement, ImageLaunchView);
              expect(results.length).toBe(1);
            })
          })

        })

      });

      describe("image launch view", function(){

      })

    });

});
