import moment from "moment";

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

export { filterEndDate }
