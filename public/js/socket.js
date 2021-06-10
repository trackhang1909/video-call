let listUserConnect
let friendsIdArr = [];

$(document).ready(function () {
    let fromId = $('.fromUser').attr('id');

    if (socket.connect) {
        console.log('socket.io is connected.')
        if (fromId) {
            socket.emit("new user", fromId);
        }
    }

    socket.on("server send user", (data) => {
        friendsIdArr = []
        listUserConnect = data

        // get id of list friends
        $('.friends').each(function (i, e) {
            friendsIdArr.push(e.id);
        });

        // Get list user online is friends
        let listFriendsOnline = arrayMatch(listUserConnect, friendsIdArr)

        listFriendsOnline.forEach(element => {
            $('#' + element).append("<span class='c-avatar__status'></span>")
        })
    })

    socket.on("user disconnected", (data) => {
        friendsIdArr = []

        // get id of list friends
        $('.friends').each(function (i, e) {
            friendsIdArr.push(e.id);
        });

        listUserConnect = data

        // Get list user online is friends
        let listFriendsOnline = arrayMatch(listUserConnect, friendsIdArr)

        // Get list user offline is friends
        let listFriendsOffline = arrayNotMatch(friendsIdArr, listFriendsOnline)

        if (listFriendsOffline.length != 0) {
            // Remove online status from avatar
            listFriendsOffline.forEach(element => {
                $('#' + element + ' .c-avatar__status').remove()
            })
        } else {
            if (friendsIdArr.length != listFriendsOnline.length) {
                // All friends off
                friendsIdArr.forEach(element => {
                    $('#' + element + ' .c-avatar__status').remove()
                })
            }
        }
    })

    socket.on("Server-sent-data", function (data) {
        if (data.id_user == fromId || data == fromId) {
            $('#right-panel').load('/account-detail .right-panel-content')
            $('.navbar').load('/ #nav-content')
            $('#middle-panel').load('/account-detail .middle-panel-content',
                () => {
                    // connect after load
                    socket.emit("new user", fromId)
                }
            )
        }
    })

    // Find element match of two array
    function arrayMatch(arr1, arr2) {
        var arr = [];
        arr = arr1.filter(element => arr2.includes(element));

        return arr;
    }

    // Find elemen NOT match of two array
    function arrayNotMatch(arr1, arr2) {
        var arr = [];
        arr = arr1.filter(element => !arr2.includes(element));

        return arr;
    }
})