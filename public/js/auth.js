$(document).ready(function () {
    // auto close alert
    $(".alert").fadeTo(2000, 500).slideUp(500, function () {
        $(".alert").alert('close');
    });
});