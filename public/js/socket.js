let socket = io()

$(document).ready(function () {
    $('#callBtn').on('click', function (e) {
        alert('click')
    })

    socket.on("Server-sent-data", function (data) {
        console.log('receive ' + data);
    });
})