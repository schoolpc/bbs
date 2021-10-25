
const firebaseConfig = {
  apiKey: "AIzaSyDRFFpDs5OmhNqNlTWCcxdSXC8DnycAMEk",
  authDomain: "bbs3-763d1.firebaseapp.com",
  projectId: "bbs3-763d1",
  databaseURL: "https://bbs3-763d1-default-rtdb.firebaseio.com/",
  storageBucket: "bbs3-763d1.appspot.com",
  messagingSenderId: "962541527528",
  appId: "1:962541527528:web:2288cded1ab8a5cf2b445d",
  measurementId: "G-5VKWM6F6DY"
};
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var dbref = database.ref("bbs");


var messageField = $('#messageInput');
var nameField = $('#nameInput');
var messageList = $('#messages');
var newList = $('#new');

// ENTERキーを押した時に発動する
function sendbutton() {
        //フォームに入力された情報
        var username = nameField.val()|| "以下、あやしげからもっちがお送りします";;
        var message = messageField.val();
        var time = new Date();
        time = time.toLocaleString();
        var type = "thread";
        var threadId;
        if (type === "thread") {
            const now = new Date();
            threadId = now.getTime().toString();
        }
        var numb = threadId;

        //データベースに保存する
        dbref.push({name:username, text:message, dat:time, type:type, ID:threadId, n:numb});
        messageField.val('');

}

    dbref.on("child_added", (snapshot)=> {
            //取得したデータ
            const data = snapshot.val();
            const ID = data.ID;
            var text = data.text;
            const name = data.name;
            const dat = data.dat;
            const type = data.type;
            text = text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');

            if(type === "thread"){
                var messageElement = $("<il><div class='card my-1 p-3' style='display:inline-block;'><h4><a class='name' href='thread.html?t="+ ID +"'>" + text + "</a></h4>" + name + " | <time class='time'>" + dat + "</time></div><p class='clear_balloon'></p></il>");
            }

            if(type === "resu"){
                var newElement = $("<il><div class='card my-1 p-3' style='display:inline-block;'>" + name + " | <time class='time'>" + dat + "</time><p id='resu'>" + text + "<br><a class='name' href='thread.html?t="+ ID +"'>元スレ</a></p></div><p class='clear_balloon'></p></il>");
                newList.prepend(newElement);
            }


            //HTMLに取得したデータを追加する
            messageList.prepend(messageElement);
    });

  
