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

    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
        console.log(input.files[0]);
    }

    $('body').on('change', ".file-upload", function (e) {
        $('#upload-avatar-form').submit()
    })

    $('body').on('submit', '#upload-avatar-form', function () {
        let userId = $('.fromUser').attr('id');

        // Show loading screen
        $("#loading").show();
        $(this).ajaxSubmit({
            data: { userId },

            success: function (response) {
                if (response.message == 'success') {
                    // Hide loading screen
                    setTimeout(function () {
                        $("#loading").hide();
                    }, 700);

                    $('#left-panel').load('/account-detail .left-panel-content')
                    $('.navbar').load('/ #nav-content')

                    $.notify(
                        "Cập nhật ảnh thành công!", {
                        className: 'success',
                        position: 'bottom center',
                        autoHide: true,
                        autoHideDelay: 2000,
                        hideAnimation: 'slideUp',
                        hideDuration: 300,
                    });
                } else {
                    // Hide loading screen
                    setTimeout(function () {
                        $("#loading").hide();
                    }, 700);

                    $.notify(
                        'Đã có lỗi xảy ra, vui lòng thử lại!', {
                        className: 'error',
                        position: 'bottom center',
                        autoHide: true,
                        autoHideDelay: 2000,
                        hideAnimation: 'slideUp',
                        hideDuration: 300,
                    });

                }
            }
        });

        return false;
    });

    $('body').on('click', '.upload-button', function () {
        $(".file-upload").click()
    })

    // if ($('.student-page').length != 0) {
    //     socket.on("Server-sent-data", function (data) {

    //     });
    // }

});