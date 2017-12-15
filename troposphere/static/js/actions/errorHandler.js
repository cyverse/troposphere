import NotificationController from "controllers/NotificationController";

export default function errorHandler(response) {

    // Note: this error handler supports jQuery style promises. When a jQuery
    // promise is rejected/fails, it calls the error handler with a jqXHR, so
    // here we are anticipating that response is a jqXHR

    let errorDetail;
    let json = response.responseJSON;
    if (json && json.detail) {
        // Returned by drf validaion exceptions
        errorDetail = json.detail;
    } else if (json && json.errors) {
        // Returned by atmosphere api exceptions
        errorDetail = json.errors[0].message;
    } else if (json) {
        // Any other form of json we don't anticipate
        errorDetail = JSON.stringify(json);
    }

    NotificationController.error(
        "Submission error",
        errorDetail || "Please contact atmosphere support: support@cyverse.org"
    );

    // Reraise the exception so other recipients can see the error
    throw response;
}

