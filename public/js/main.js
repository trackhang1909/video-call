let socket = io();

$(document).ready(function () {
    $('#loading').hide();

    // Answer call
    socket.on('answer-call', data => {
        $('#answerModal .modal-body span').text('Bạn nhận được cuộc gọi từ ' + data.userCallFrom.fullname);
        $('#answerModal .modal-footer .btn-success').on('click', () => {
            window.location = '/call?id=' + data.peerId;
        });
        $('#answerModal .modal-footer .btn-danger').on('click', () => {
            socket.emit('reject-call', data);
        });
        $('#answerModal').modal('show');
    });

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

        // Show loading screen
        $("#loading").show();

        $.ajax({
            type: "post",
            url: "user/accept/" + toId,
            data: { userId },
            success: function (response) {
                // Hide loading screen
                setTimeout(function () {
                    $("#loading").hide();
                }, 700);

                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load(
                    // url
                    '/account-detail .middle-panel-content',
                    // callback
                    () => {
                        friendsIdArr = [];

                        $('.friends').each(function (i, e) {
                            friendsIdArr.push(e.id);
                        });

                    }
                )
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
                // socket.emit("new user", userId);
            }
        });
    });

    $('body').on('click', '.declineBtn', function (e) {
        let userId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        // Show loading screen
        $("#loading").show();

        $.ajax({
            type: "post",
            url: "user/decline/" + toId,
            data: { userId },
            success: function (response) {

                // Hide loading screen
                setTimeout(function () {
                    $("#loading").hide();
                }, 700);

                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load(
                    // url
                    '/account-detail .middle-panel-content',
                    // callback
                    () => {
                        friendsIdArr = [];

                        $('.friends').each(function (i, e) {
                            friendsIdArr.push(e.id);
                        });

                    }
                )
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
                socket.emit("new user", userId);
            }
        });
    });

    $('body').on('click', '.unfriendBtn', function (e) {
        let userId = $('.fromUser').attr('id');
        let toId = $(this).attr('id');

        // Show loading screen
        $("#loading").show();

        $.ajax({
            type: "post",
            url: "user/unfriend/" + toId,
            data: { userId },
            success: function (response) {

                // Hide loading screen
                setTimeout(function () {
                    $("#loading").hide();
                }, 700);

                $('#right-panel').load('/account-detail .right-panel-content')
                $('#middle-panel').load('/account-detail .middle-panel-content')
                $('.navbar').load('/ #nav-content')
                socket.emit("Client-sent-data", toId);
                socket.emit("new user", userId);
            }
        });
    });
})

function addFriend(event) {
    if (event.className === 'btn btn-secondary btn-sm') {
        event.parentNode.innerHTML = '<button onclick="addFriend(this)" type="button" class="btn btn-danger btn-sm">Hủy kết bạn</button>'
    }
    else {
        event.parentNode.innerHTML = '<button onclick="addFriend(this)" type="button" class="btn btn-secondary btn-sm">Kết bạn</button>';
    }
}

if (window.location.pathname === '/') {
    //Click call
    let btnCall = document.getElementById('call');
    btnCall.addEventListener('click', () => {
        const id = document.getElementById('remote-id').value;
        window.location = '/call?id=' + id;
    });
}

if (window.location.pathname === '/account-detail') {
    function clickCall(event) {
        const callFromId = event.dataset.callFromId;
        const callToId = event.dataset.callToId;
        window.location = '/call?callFromId=' + callFromId + '&callToId=' + callToId;
    }
}

if (window.location.pathname === '/call') {

    // Reject call
    socket.on('reject-call-from', data => {
        $('#rejectModal .modal-body span').text(data.fullname + ' đã từ chối cuộc gọi của bạn');
        $('#rejectModal .modal-footer .btn-success').on('click', () => {
            window.location = '/';
        });
        $('#rejectModal').modal('show');
    });

    const peer = new Peer();
    let streamCall;
    // Get remote id
    const url_string = window.location.href;
    const url = new URL(url_string);
    const remoteId = url.searchParams.get('id');
    // Get call from - to id
    const callFromId = url.searchParams.get('callFromId');
    const callToId = url.searchParams.get('callToId');
    let peerId = null;

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
        peerId = id;
        //Call
        openStream().then(stream => {
            playStream('local-stream', stream);
            streamCall = stream;
            let falseId = 0;
            // Check call id
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
            // Emit event to server
            if (callFromId !== null && callToId !== null) {
                const data = {
                    callFromId,
                    callToId,
                    peerId
                }

                $('#friend-name').text('Khang Hello');
                socket.emit('call-video', data);
            }
        });
    });

    //Answer
    peer.on('call', call => {
        call.answer(streamCall);
        call.on('stream', remoteStream => {
            playStream('remote-stream', remoteStream);
        });
    });

    $(function () {
        $('.fa-minus').click(function () {
            $(this).closest('.chatbox').toggleClass('chatbox-min');
        });
    });

    // Send message
    $('#send').on('click', () => {
        let message = $('#message');
        $('#chat-box').append(`
            <div class="message-box-holder">
                <div class="message-box">
                    ${message.val()}
                </div>
            </div>
        `);
        socket.emit('send-message', message.val());
        message.val('');
    });


}
