let socket = io()

$(document).ready(function () {
    $('#callBtn').on('click', function (e) {
        alert('click')
    })

    socket.on("Server-sent-data", function (data) {
        let fromId = $('.fromUser').attr('id');
        if (data.id_user == fromId) {
            $('#right-panel').load('/account-detail .right-panel-content')
            $('.navbar').load('/ #nav-content')
        }
    });
})