import toastr from "toastr";

export function alertFail(msg, title) {
    let toastrDefaults = {
        closeButton: true,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        preventDuplicates: true,
        onclick: null,
        showDuration: "260",
        hideDuration: "1000",
        timeOut: "6000",
        extendedTimeOut: "650",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

    toastr.warning(msg, title, toastrDefaults);
}
