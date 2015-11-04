/**
 *
 * View for user-submitted feedback.
 *
 */
Atmo.Views.FeedbackLink = Backbone.View.extend({
    initialize: function() {
        var self = this;
        this.$el.popover({
            placement : 'top',
            title: 'Feedback Form <a class="close" data-dismiss="popover" href="#">&times</a>',
            html: true,
            trigger: 'click',
            content: _.template(Atmo.Templates.feedback_form),
        }).click(function() {
            $('a[data-dismiss="popover"]').click(_.bind(self.cancel_popover, self));
            $('#cancel_popover').click(_.bind(self.cancel_popover, self));
            $('#submit_feedback').click(_.bind(self.submit_feedback, self));
        });
    },
    cancel_popover: function(e) {
        e.preventDefault();
        this.$el.popover('hide');
    },
    submit_feedback: function(e) {
        e.preventDefault();

        // TODO: Send json to the feedback api rather than a string. That way
        // on the server side we can take advantage of templates. Right now
        // the feedback email is ugly. Because we use a combination of
        // templates, and a raw string.

        var data = {
            'user-interface': 'airport',
            'location': window.location.href,
            'message': $('#feedback').val(),
            'resolution': {
                'viewport': {
                    'width': $(window).width(),
                    'height': $(window).height()
                },
                'screen': {
                    'width':  screen.width,
                    'height': screen.height
                }
            }
        };

        if ($('#feedback').val().length > 0) {

            $('#submit_feedback').html('<img src="'+site_root+'/assets/resources/images/loader.gif" /> Sending...').attr('disabled', 'disabled');

            $.ajax(Atmo.API_V2_ROOT + '/email/feedback', {
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/json',
                success: function(data) {

                    // setTimeout to prevent loader gif from flashing on fast responses
                    setTimeout(function() {

                        $('#feedback_link').popover('hide');

                        Atmo.Utils.notify("Thanks for your feedback!", "Support has been notified.");

                    }, 2*1000);
                },
                error: function(response_text) {
                    Atmo.Utils.notify("An error occured", 'Your feedback could not be submitted. If you\'d like to send it directly to support, email <a href="mailto:support@iplantcollaborative.org">support@iplantcollaborative.org</a>.');
                }
            });
        }
    }
});
