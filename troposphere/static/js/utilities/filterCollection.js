import backbone from 'backbone';
import moment from 'moment';
import ImageVersionCollection from 'collections/ImageVersionCollection';

const filterEndDate = (version) => {
            let dateNow = moment(new Date()).format();
            let endDate = version.get('end_date')
            if (!endDate) { return true }
            if (endDate.format() === "Invalid date") { return true }
            if (endDate.isAfter(dateNow)) { return true }
            return false
        }

export { filterEndDate }
