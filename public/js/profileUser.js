$(document).ready(function () {
    $('body').on('click', '.requestBtn', function (e) {

        let fromId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        console.log(toId);

        $(this).attr('class', 'btn btn-danger btn-sm')
        $(this).text('Hủy lời mời')
        $.ajax({
            type: "post",
            url: "/user/request/" + toId,
            data: { fromId },
            success: function (response) {
                let data = response.data
                console.log(data);
                if (response.success) {
                    socket.emit("Client-sent-data", data);
                    $('#right-panel').load('/account-detail .right-panel-content')
                }
            }
        });

    })

    $('body').on('click', '.cancel-requestBtn', function (e) {
        let fromId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        console.log(toId);


        $(this).attr('class', 'btn btn-secondary btn-sm')
        $(this).text('Kết bạn')

        $.ajax({
            type: "post",
            url: "/user/cancel-request/" + toId,
            data: { fromId },
            success: function (response) {
                let data = response.data
                console.log(data);
                if (response.success) {
                    socket.emit("Client-sent-data", data);
                    $('#right-panel').load('/account-detail .right-panel-content')
                }
            }
        })
    })

    $(".file-upload").on('change', function () {
        readURL(this);
    });

    $(".upload-button").on('click', function () {
        $(".file-upload").click();
    });


    // if ($('.student-page').length != 0) {
    //     socket.on("Server-sent-data", function (data) {

    //     });
    // }

});