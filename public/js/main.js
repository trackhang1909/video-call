let socket = io();
let socketId = null;

socket.on('connect', () => {
    socketId = socket.id;
    const data = {
        'socketId': socket.id
    }
    fetch('/save-socket', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

// Answer call
socket.on('answer-call', data => {
    $('#answerModal .modal-body span').text('Bạn nhận được cuộc gọi từ ' + data.userCallFrom.fullname);
    $('#answerModal .modal-footer .btn-success').on('click', () => {
        window.location = '/call?id=' + data.peerId + '&callFromId=' + data.userCallFrom._id;
    });
    $('#answerModal .modal-footer .btn-danger').on('click', () => {
        socket.emit('reject-call', data);
    });
    $('#answerModal').modal('show');
});

$(document).ready(function () {
    $('#loading').hide();

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

if (window.location.pathname !== '/call') {
    sessionStorage.removeItem('socketId');
    sessionStorage.removeItem('reloadCall');
    sessionStorage.removeItem('person');
}

const loadIce = async () => {
    $('#loading-call').show();
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function($evt){
        if(xhr.readyState == 4 && xhr.status == 200){
            let res = JSON.parse(xhr.responseText);
            console.log("response: ", res);
            createPeer(res.v)
        }
    }
    xhr.open("PUT", "https://global.xirsys.net/_turn/VideoCall", true);
    xhr.setRequestHeader("Authorization", "Basic " + btoa("trackhang1909:d4239138-d1b1-11eb-a883-0242ac130002") );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send( JSON.stringify({"format": "urls"}) );
}

if (window.location.pathname === '/call') {
    loadIce()
    function copyText(event) {
        const el = document.createElement('textarea');
        el.value = event.dataset.id;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Sao chép mã cuộc gọi thành công');
    }
    function changeView () {
        $('#local-stream').toggleClass('local-stream-cls local-stream-cls-2');
        $('#remote-stream').toggleClass('remote-stream-cls remote-stream-cls-2');
    }
}

const createPeer = (ice) => {
    $('#loading-call').hide();
    const peer = new Peer({
        key: 'peerjs',
        host: 'video-call-tdtu-peer-server.herokuapp.com',
        secure: true,
        debug: 3,
        port: 443,
        config: { 'iceServers': [
            { url: ice.iceServers.urls[0] },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[1],
                credential: ice.iceServers.credential
            },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[2],
                credential: ice.iceServers.credential
            },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[3],
                credential: ice.iceServers.credential
            },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[4],
                credential: ice.iceServers.credential
            },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[5],
                credential: ice.iceServers.credential
            },
            {
                username: ice.iceServers.username,
                url: ice.iceServers.urls[6],
                credential: ice.iceServers.credential
            }
        ]}
    });

    let person = sessionStorage.getItem('person');
    let existName = $('#friend-name').text();
    if (!person && !existName) {
        person = prompt('Hãy nhập tên của bạn');
    }

    // Reject call
    socket.on('reject-call-from', data => {
        $('#rejectModal .modal-body span').text(data.fullname + ' đã từ chối cuộc gọi của bạn');
        $('#rejectModal .modal-footer .btn-success').on('click', () => {
            window.location = '/';
        });
        $('#rejectModal').modal('show');
    });

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
        myPeerId.innerHTML = `
            <button type="button" class="btn btn-sm btn-secondary" data-id="${id}" onclick="copyText(this)">
                <i class="fa fa-files-o" aria-hidden="true"></i>
            </button>
            ${id}
        `;
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
                        // Send peer id to remote (receive caller)
                        let conn = peer.connect(remoteId);
                        const data = {
                            socketId,
                            peerId,
                            person
                        }
                        conn.on('open', function() {
                            conn.send(data);
                        });
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
                socket.emit('call-video', data);
            }
        });
    });

    //Answer
    peer.on('call', call => {
        call.answer(streamCall);
        call.on('stream', remoteStream => {
            playStream('remote-stream', remoteStream);
            peer.on('connection', (conn) => {
                conn.on('open', () => {
                    // Receive peer id from receive caller
                    conn.on('data', (data) => {
                        sessionStorage.setItem('socketId', data.socketId);
                        sessionStorage.setItem('reloadCall', data.peerId);
                        let newPerson = sessionStorage.getItem('person');
                        if (!existName) {
                            if (newPerson) {
                                $('#friend-name').text(newPerson);
                            } else {
                                sessionStorage.setItem('person', data.person);
                                $('#friend-name').text(data.person);
                            }
                        }
                        // Send socket id to receiver (first time)
                        const socketData = {
                            socketTo: data.socketId,
                            socketId: socketId,
                            person
                        }
                        socket.emit('send-socket-id', socketData);
                    });
                });
            });
        });
    });

    $(function () {
        $('.fa-minus').click(function () {
            $(this).closest('.chatbox').toggleClass('chatbox-min');
        });
    });

    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });

    let perfEntries = performance.getEntriesByType("navigation");
    perfEntries.forEach(p => {
        let reloadCall = sessionStorage.getItem('reloadCall');
        if (reloadCall && p.type === 'reload') {
            if (callFromId !== null && callToId !== null) {
                window.location.href = '/call?id=' + reloadCall + '&callFromId=' + callFromId + '&callToId=' + callToId;
            }
            else if (callFromId !== null) {
                window.location.href = '/call?id=' + reloadCall + '&callFromId=' + callFromId;
            }
            else {
                window.location.href = '/call?id=' + reloadCall;
            }
        }
    });

    socket.on('receive-socket-id', (data) => {
        sessionStorage.setItem('socketId', data.socketId);
        let newPerson = sessionStorage.getItem('person');
        if (!existName) {
            if (newPerson) {
                $('#friend-name').text(newPerson);
            } else {
                sessionStorage.setItem('person', data.person);
                $('#friend-name').text(data.person);
            }
        }
    });

    $('#send').on('click', () => {
        let message = $('#message').val();
        let socketId = sessionStorage.getItem('socketId');
        $('#chat-box').append(`<div class="message-box-holder">
            <div class="message-box">
                ${ message }
            </div>
        </div>`);
        $('#message').val('');
        if (socketId) {
            const data = {
                message, socketId
            }
            socket.emit('send-message', data);
        }
    });

    socket.on('receive-message', (data) => {
        $('#chat-box').append(`<div class="message-box-holder">
            <div class="message-box message-partner">
                ${ data }
            </div>
        </div>`);
    });

    socket.on('friend-disconnect-receive', () => {
        alert('Người nhận đã bị mất kết nối');
    })

    setInterval(() => {
        var ifConnected = window.navigator.onLine;
        if (!ifConnected) {
            alert('Bạn đã bị mất kết nối');
            let socketId = sessionStorage.getItem('socketId');
            socket.emit('friend-disconnect', socketId);
        }
    }, 3000);
}