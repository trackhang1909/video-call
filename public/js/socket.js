$(document).ready(function () {
    let friendsIdArr = [];

    // get id of list friends
    $('.friends').each(function (i, e) {
        friendsIdArr.push(e.id);
    });

    console.log(friendsIdArr);

    let fromId = $('.fromUser').attr('id');

    if (socket.connect) {
        console.log('socket.io is connected.')
        if (fromId) {
            socket.emit("Client-sent-data", fromId);
        }
    }

    $('#callBtn').on('click', function (e) {
        alert('click')
    })

    socket.on("Server-sent-data", function (data) {
        if (data.id_user == fromId || data == fromId) {
            $('#right-panel').load('/account-detail .right-panel-content')
            $('.navbar').load('/ #nav-content')
            $('#middle-panel').load('/account-detail .middle-panel-content')
        }

        friendsIdArr.forEach(element => {
            if (element == data) {

                $('#' + element).append("<span class='c-avatar__status'></span>")
                // $('#' + element).children(".c-avatar__status").css("display", "none")

                console.log('zzzz');
            }


        });
    });

    // if (socket.disconnect) {
    //     isOnlineArr = isOnlineArr.filter(item => item !== fromId)
    // }
})