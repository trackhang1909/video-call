function addFriend(event) {
    if (event.className === 'btn btn-secondary btn-sm') {
        event.parentNode.innerHTML = '<button onclick="addFriend(this)" type="button" class="btn btn-danger btn-sm">Hủy kết bạn</button>'
    }
    else {
        event.parentNode.innerHTML = '<button onclick="addFriend(this)" type="button" class="btn btn-secondary btn-sm">Kết bạn</button>';
    }
}

$("#loading").show();

if (window.location.pathname === '/') {
    //Click call
    let btnCall = document.getElementById('call');
    btnCall.addEventListener('click', () => {
        const id = document.getElementById('remote-id').value;
        window.location = '/call?id=' + id;
    });
}

if (window.location.pathname === '/call') {

    const peer = new Peer();
    let streamCall;
    let url_string = window.location.href;
    let url = new URL(url_string);
    let remoteId = url.searchParams.get('id');

    function openStream() {
        const config = { audio: false, video: true };
        return navigator.mediaDevices.getUserMedia(config);
    }

    function playStream(idVideoTag, stream) {
        const video = document.getElementById(idVideoTag);
        video.srcObject = stream;
        video.play();
    }

    //Show peer id
    peer.on('open', id => {
        let myPeerId = document.getElementById('my-peer-id');
        myPeerId.innerHTML = 'Mã cuộc gọi: ' + id;
    });

    //Call
    openStream().then(stream => {
        playStream('local-stream', stream);
        streamCall = stream;
        let falseId = 0;
        let interval = setInterval(() => {
            if (remoteId !== null) {
                const call = peer.call(remoteId, streamCall);
                call.on('stream', remoteStream => {
                    playStream('remote-stream', remoteStream);
                    clearInterval(interval);
                    console.log('Clear success');
                });
                falseId++;
                if (falseId === 10) {
                    clearInterval(interval);
                    alert('Mã cuộc gọi không tồn tại');
                }
            }
        }, 1000);
    });

    //Answer
    peer.on('call', call => {
        call.answer(streamCall);
        call.on('stream', remoteStream => {
            playStream('remote-stream', remoteStream);
        });
    });

}

$(document).ready(function () {
    $('body').on('click', '#notificationLink', function (e) {
        if ($('#notificationContainer').css('display') == 'none') {
            $("#notificationContainer").fadeToggle(300);
            $("#notification_count").fadeOut("slow");
            $('#notificationLink').attr('class', 'far fa-bell fa-lg');

            let userId = $('.fromUser').attr('id');

            $.ajax({
                type: "post",
                url: "/notify/seen/" + userId,
            });

            return false;
        } else {
            $('.new-notification').css('background-color', 'white')
        }


    });

    //Document Click hiding the popup 
    $(document).on('click', function (e) {
        if ((e.target.id == "notificationsBody") == false
            && (e.target.id == "notificationTitle") == false
            && (e.target.id == "notificationFooter") == false
            && (e.target.tagName == 'TD') == false) {

            // Hide notification board
            $("#notificationContainer").fadeOut(300);
            // Clear new notification
            $('.new-notification').css('background-color', 'white')
        }
    });

    // Popup on click
    // $("#notificationContainer").click(function () {
    //     // $("#notificationContainer").hide();
    //     // $('#notificationLink').attr('class', 'far fa-bell fa-lg');
    //     return false;
    // })

    $('body').on('click', '.acceptBtn', function (e) {
        let userId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        $.ajax({
            type: "post",
            url: "user/accept/" + toId,
            data: { userId },
            success: function (response) {
                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load('/account-detail .middle-panel-content')
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
            }
        });
    });

    $('body').on('click', '.declineBtn', function (e) {
        let userId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        $.ajax({
            type: "post",
            url: "user/decline/" + toId,
            data: { userId },
            success: function (response) {
                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load('/account-detail .middle-panel-content')
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
            }
        });
    });

    $('body').on('click', '.unfriendBtn', function (e) {
        let userId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        $.ajax({
            type: "post",
            url: "user/unfriend/" + toId,
            data: { userId },
            success: function (response) {
                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load('/account-detail .middle-panel-content')
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
            }
        });
    });
})