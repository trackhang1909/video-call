$(document).ready(function () {
    $('body').on('click', '.requestBtn', function (e) {

        let fromId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        $(this).attr('class', 'btn btn-danger btn-sm')
        $(this).text('Hủy lời mời')
        $("#loading").show();

        $.ajax({
            type: "post",
            url: "/user/request/" + toId,
            data: { fromId },
            success: function (response) {
                let data = response.data
                console.log(data);
                if (response.success) {
                    setTimeout(function () {
                        $("#loading").hide();
                    }, 700);
                    socket.emit("Client-sent-data", data);
                    $('#right-panel').load('/account-detail .right-panel-content')
                    socket.emit("new user", fromId);
                }
            }
        });

    })

    $('body').on('click', '.cancel-requestBtn', function (e) {
        let fromId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        $(this).attr('class', 'btn btn-secondary btn-sm')
        $(this).text('Kết bạn')

        // Show loading screen
        $("#loading").show();

        $.ajax({
            type: "post",
            url: "/user/cancel-request/" + toId,
            data: { fromId },
            success: function (response) {
                let data = response.data
                console.log(data);
                if (response.success) {

                    // Hide loading screen
                    setTimeout(function () {
                        $("#loading").hide();
                    }, 700);

                    socket.emit("Client-sent-data", data);
                    $('#right-panel').load('/account-detail .right-panel-content')
                    socket.emit("new user", fromId);
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