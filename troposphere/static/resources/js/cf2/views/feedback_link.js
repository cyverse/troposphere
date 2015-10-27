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

        data["message"] = $('#feedback').val();

        // Create a list of user's instances and volumes to make support easier
        var username = Atmo.profile.get('id');
        data["message"] += '\nUsername: ' + username +
                           '\n---\n\n' + 
                           'Provider: ' + Atmo.profile.get('selected_identity').get('provider_id') + '\n\n' +
                           '\n\n' + username + "'s Instances:" +
                           '\n---\n';

        for (var i = 0; i < Atmo.instances.length; i++) {
            var instance = Atmo.instances.models[i];
            data["message"] += '\nName:\n\t' + instance.get('image_name') + 
                               '\nID:\n\t' + instance.get('id') + 
                               '\nImage:\n\t' + instance.get('image_id') + 
                               '\nIP Address:\n\t' + instance.get('public_dns_name') + '\n';
        }
        data["message"] += '\n\n' + username + "'s Volumes:" +
                           '\n---\n';

        if (Atmo.volumes.length > 0) {
            for (var i = 0; i < Atmo.volumes.length; i++) {
                var volume = Atmo.volumes.models[i];
                data["message"] += '\nID:\n\t' + volume.get('id') + '\nName:\n\t' + volume.get('name');
            }
            data["message"] += '\n\n';
        }

        var self = this;

        if ($('#feedback').val().length > 0) {

            $('#submit_feedback').html('<img src="'+site_root+'/assets/resources/images/loader.gif" /> Sending...').attr('disabled', 'disabled');
            glob = data;
            console.log("data",data);

            $.ajax(Atmo.API_ROOT + '/email/feedback', {
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
