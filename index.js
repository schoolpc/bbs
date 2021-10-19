// データベースと接続する
var messagesRef = new Firebase('https://bbs1-fc402-default-rtdb.firebaseio.com/');

var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#messages');

// ENTERキーを押した時に発動する
function sendbutton() {
        //フォームに入力された情報
        var username = nameField.val()|| "以下、あやしげからもっちがお送りします";;
        var message = messageField.val();
        var time = new Date();
        time = time.toLocaleString();
        var type = "thread";
        var numb = 0;
        var threadId;
        if (type === "thread") {
            const now = new Date();
            threadId = now.getTime().toString();
        }

        //データベースに保存する
        messagesRef.push({name:username, text:message, dat:time, type:type, ID:threadId, n:numb});
        messageField.val('');

        $('#scroller').scrollTop($('#messages').height());
}

var threadcont = [];
// データベースにデータが追加されたときに発動する
messagesRef.on('child_added', function (snapshot) {
    //取得したデータ
    var data = snapshot.val();
    var username = data.name;
    var message = data.text;
    var time = data.dat;
    var type = data.type;
    var ID = data.ID;


    if (data.type === "thread") {
    var messageElement = $("<il><p class='sender_name'></p><div class='left_balloon'><h3><a href='thread.html?t="+ ID +"'>" + message + "</a></h3>" + username + " | " + time + "</div><p class='clear_balloon'></p></il>");
    }
    //HTMLに取得したデータを追加する
    messageList.append(messageElement)

    //一番下にスクロールする
    $('#scroller').scrollTop($('#messages').height());
});