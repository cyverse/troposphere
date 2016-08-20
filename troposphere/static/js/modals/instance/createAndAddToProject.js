import modals from 'modals';
import _ from 'underscore';


export default {
    createAndAddToProject: function (options) {
        if (!options.project) {
            throw new Error("Missing project");
        }

        modals.InstanceModals.launch(_.extend({ initialView: "IMAGE_VIEW" }, options));
    }
};
