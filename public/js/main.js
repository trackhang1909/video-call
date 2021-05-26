function addFriend (event) {
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