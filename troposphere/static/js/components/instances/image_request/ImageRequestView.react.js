/** @jsx React.DOM */

define(
  [
    'react',
    'components/common/PageHeader.react',
    'jquery',

    // jQuery plugins: need to make sure they're loaded, but they aren't called directly
    'chosen'
  ],
  function (React, PageHeader, $) {

    return React.createClass({

      propTypes: {
        instance: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        provider: React.PropTypes.instanceOf(Backbone.Model).isRequired,
        tags: React.PropTypes.instanceOf(Backbone.Collection).isRequired
      },

      componentDidMount: function () {
        var el = this.getDOMNode();
        var $el = $(el);
        $el.find('select[name="tags"]').chosen();
      },

      render: function () {
        var instance = this.props.instance,
            provider = this.props.provider;

        renderInputControlGroup = function(){
          return (
            <div className="control-group">
              <label htmlFor="name" className="control-label">Image Name</label>
              <div className="controls">
                <div className="help-block">
                  Something meaningful to help users find this image. Please limit name to 30 characters.
                </div>
                <input type="text" name="name" className="form-control" maxLength="30" size="15" />
              </div>
            </div>
          );
        }

        var renderControlGroup = function(label, id){
          return (
            <div className="control-group">
              <label htmlFor="instance" className="control-label">{label}</label>
              <div className="controls">{id}</div>
              <input type="hidden" name="instance" value={id} />
            </div>
          );
        }

        var renderDropdownControlGroup = function(){
          return (
            <div className="control-group">
              <label htmlFor="provider" className="control-label">Cloud for Deployment</label>
              <div className="controls">
                <div className="help-block">Select the cloud provider on which you plan to use this image.</div>
                <select name="provider" className="form-control">
                  <option value={4}>iPlant Cloud - Tucson</option>
                </select>
              </div>
            </div>
          );
        }

        var renderTextAreaControlGroup = function(label, description, name){
          return (
            <div className="control-group">
              <label htmlFor={name} className="control-label">{label}</label>
              <div className="controls">
                <div className="help-block">{description}</div>
                <textarea name={name} rows="4" className="form-control" />
              </div>
            </div>
          );
        }

        var displayNoneStyle = {display: 'none'};
        var renderImageTagsControlGroup = function(){
          var tags = this.props.tags.map(function(tag){
            var tagName = tag.get('name');
            return (
              <option key={tag.id} value={tagName}>{tagName}</option>
            );
          });

          return (
            <div className="control-group">
              <label htmlFor="tags" className="control-label">Image Tags</label>
              <div className="controls tagger_container">
                <div className="help-block">
                  Please include tags that will help users decide whether this image will suit their
                  needs. You can include the operating system, installed software, or configuration information. E.g. Ubuntu,
                  NGS Viewers, MAKER, QIIME, etc.
                </div>
                <select name="tags" data-placeholder="Select tags to add..." multiple className="form-control">
                  {tags}
                </select>
                <input type="hidden" name="tags" className="tag_input" />
              </div>
            </div>
          );
        }.bind(this);

        var renderImageVisibilityControlGroup = function(){
          return (
            <div className="control-group">
              <label htmlFor="vis" className="control-label">Image Visibility</label>
              <div className="controls">
                <div className="help-block" id="vis_help">
                  A VM image can be made visible to you, a select group of users or to
                  everyone. If you want visibility restricted to a select group of users, provide us a list of iPlant
                  usernames. Public visibility means that any user will be able to launch the instance.
                </div>
                <select name="vis" className="form-control">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="select">Specific Users</option>
                </select>
              </div>
            </div>
          );
        }

        var renderCheckboxControlGroup = function(){
          return (
            <div className="control-group">
              <div className="checkbox">
                <label className="checkbox">
                  <input type="checkbox" id="licensed_software" />
                  <strong>
                    I certify that this image does not contain license-restricted software that is prohibited from being
                    distributed within a virtual or cloud environment.
                  </strong>
                </label>
                <br />
              </div>
            </div>
          );
        }

        var renderFormActions = function(){
          return (
            <button type="submit" className="btn btn-primary form-control">Request Imaging</button>
          );
        }

        var helpText = function(){
          return (
            <p>
              Please read the
              <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank"> wiki page about requesting an image of your instance </a>
              before completing the form below.
            </p>
          );
        }

        var systemFilesHelpText = (
          <div>
            If your VM image requires a change in an iPlant-managed system file (see
              <a href="https://pods.iplantcollaborative.org/wiki/x/oIZy" target="_blank">{"Important Notes #4"}</a>
            ), let us know the change and why the change is necessary.
          </div>
        );

        return (
          <div className="imaging_form module">
            <PageHeader title="Request Imaging" helpText={helpText}/>

            <form className="request_imaging_form form-horizontal" method="post">

            <div className="alert alert-danger">
              <strong>Note:</strong> All volumes must be detached from an instance before it can be imaged.
            </div>

            {renderInputControlGroup()}
            {renderControlGroup("Instance ID", "0bbbc916-0c76-4006-a86c-e570c96ff819")}
            {renderControlGroup("IP Address", "128.196.64.25")}
            {renderDropdownControlGroup()}
            {renderTextAreaControlGroup(
              "Description of the Image",
              "Concisely describe the tools installed and their purpose. Please include key words that will " +
                "help users search for this image and decide whether it will suit their needs.",
              "description"
            )}
            {renderTextAreaControlGroup(
              "List Installed Software",
              "List any software that you have installed. If the paths to the executables are different " +
                "from /usr/bin or /usr/local/bin, list those also.",
              "software"
            )}
            {renderTextAreaControlGroup(
              "iPlant-managed System Files",
              systemFilesHelpText,
              "sys"
            )}
            {renderTextAreaControlGroup(
              "Files to exclude",
              "If your instance has files you'd like to exclude from the image, list them here. Write one path per line.",
              "exclude"
            )}
            {renderImageTagsControlGroup()}
            {renderImageVisibilityControlGroup()}
            {renderCheckboxControlGroup()}
            {renderFormActions()}

            </form>

          </div>
          );
      }

    });

  });
