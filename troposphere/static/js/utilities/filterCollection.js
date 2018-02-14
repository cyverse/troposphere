import moment from "moment";

import Instance from "models/Instance";


const filterEndDate = (version) => {
    let dateNow = moment(new Date()).format();
    let endDate = version.get("end_date")
    if (!endDate) {
        return true
    }
    if (endDate.format() === "Invalid date") {
        return true
    }
    if (endDate.isAfter(dateNow)) {
        return true
    }
    return false
}

const filterInstances = (resource) => {
    return resource instanceof Instance;
}

export { filterEndDate, filterInstances }
