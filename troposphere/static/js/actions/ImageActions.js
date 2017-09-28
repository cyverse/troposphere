import moment from "moment";
import AppDispatcher from "dispatchers/AppDispatcher";
import ImageConstants from "constants/ImageConstants";

export default {

    updateImageAttributes: function(image, newAttributes) {
        if (newAttributes.end_date != null) {
            var end_date;
            if (typeof newAttributes.end_date === "object") {
                end_date = newAttributes.end_date
            } else {
                end_date = moment(newAttributes.end_date, "M/DD/YYYY hh:mm a z");
            }
            newAttributes.end_date = end_date;
        }
        image.set({
            name: newAttributes.name,
            is_public: newAttributes.is_public,
            description: newAttributes.description,
            access_list: newAttributes.access_list,
            end_date: newAttributes.end_date,
            tags: newAttributes.tags
        });
        AppDispatcher.handleRouteAction({
            actionType: ImageConstants.IMAGE_UPDATE,
            payload: {
                image: image
            }
        });
    }

};
