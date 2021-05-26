$(document).ready(function () {

    $('.requestBtn').on('click', function (e) {
        let fromId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');
        e.preventDefault()

        if ($(this).attr('class').includes('btn btn-secondary btn-sm')) {
            $(this).attr('class', 'btn btn-danger btn-sm')
            $(this).text('Hủy lời mời')
            $.ajax({
                type: "post",
                url: "/user/request/" + toId,
                data: { fromId },
                success: function (response) {
                    console.log('send');
                }
            });
        } else {
            $(this).attr('class', 'btn btn-secondary btn-sm')
            $(this).text('Kết bạn')

            $.ajax({
                type: "post",
                url: "/user/cancel-request/" + toId,
                data: { fromId },
                success: function (response) {
                    console.log('cancel');
                }
            });
        }
    })

    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

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