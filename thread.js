
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
var button = $('#button');
var scroller = $('#scroller');
var title = $('#title');
var newList = $('#new');


//urlパラメータを取得
var url = new URL(window.location.href);
var params = url.searchParams;
var thID = params.get('t');



// フォーム送信時
function sendbutton() {
        //フォームに入力された情報
        var username = nameField.val()|| "以下、あやしげからもっちがお送りします";
        var message = messageField.val();
        var time = new Date();
        time = time.toLocaleString();
        var type = "resu";
        var numb = threadcont.length + 1;
        var threadId = thID;

        //データベースに保存する

        let list = [];
        dbref.orderByChild('n').equalTo(thID)
        .once("value", (data)=> {
            if (data) {
                const rootList = data.val();
                const key = data.key;
                // データオブジェクトを配列に変更する
                if(rootList != null) {
                    Object.keys(rootList).forEach((val, key) => {
                        rootList[val].id = val;
                        list.unshift(rootList[val]);
                        console.log(list);
                    })
                }
            }
        });
        console.log(list[0].id)
        dbref.child(list[0].id).remove();

        dbref.push({name:list[0].name, text:list[0].text, dat:list[0].dat, type:"thread", ID:thID, n:thID});
        dbref.push({name:username, text:message, dat:time, type:type, ID:threadId, n:numb});
        messageField.val('');

        $('#scroller').scrollTop($('#messages').height());
};

let threadcont = [];
let threadElement = [];

dbref.on('child_added', function (snapshot) {
    var data = snapshot.val();
    var key = snapshot.key;
    var username = data.name;
    var message = data.text;
    var time = data.dat;
    var type = data.type;
    var ID = data.ID;
    var numb = data.n;
    if ( message.match(/iframe/)) {
        var msg = message;
    }else{
        var msg = message.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi, "<a href='$1' target='_blank'>$1</a><br><img src='$1' style ='max-height:300px'></img>");
    }
    console.log(key);

    if (data.ID == thID && data.type === "resu" ) {
        threadcont.push({name:username, text:msg, dat:time, type:type, ID:ID, n:numb});
    }
    if (data.ID == thID && data.type === "thread" ) {
        threadElement.push({name:username, text:msg, dat:time, type:type, ID:ID, key:key});
    }
});


// データベースにデータが追加されたときに発動する
dbref.on('child_added', function (snapshot) {
    //取得したデータ
    var data = snapshot.val();
    var username = data.name;
    var message = data.text;
    var time = data.dat;
    var type = data.type;
    var ID = data.ID;
    var numb = data.n;
    
    if ( message.match(/iframe/)) {
        var msg = message;
    }else{
        var msg = message.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi, "<a href='$1' target='_blank'>$1</a><br><img src='$1' style ='max-height:300px'></img>");
    }
    
    var msgnew = message.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi, "<a href='$1' target='_blank'>$1</a>");
    var msgurl = message.replace(/(http(s)?:\/\/[a-zA-Z0-9-.!'()*;/?:@&=+$,%#]+)/gi, "<a href='$1' target='_blank'>$1</a><br><img src='$1' style ='max-height:300px'></img>");


    if ( msg.search(/^>>+\d{1,}/gm) !== -1) { 
        var renum = /^>>+\d{1,}/gm.exec(msg); 
        renum = renum[0].substr(2);
        renum = renum;
        msg = msg.replace(/^>>+(\d{1,})/g, "<div id = 'resu' class='card p-2 m-1'>" + threadcont[renum-1].n + threadcont[renum-1].name + " | " + threadcont[renum-1].dat + "<br>" + threadcont[renum-1].text + "</div>" + ">>" + renum);

    }

    if (data.type === "resu" && data.ID === thID) {
        if ( username == nameField.val() ) {

            var messageElement = $("<il><p class='sender_name me'>" + numb + " " + username + "</p><br><div class='mx-'><div class='right_balloon me'>" + msg + "</div></div><p class='clear_balloon'></p></il>");
    
        } else {
        var messageElement = $("<il><p class='sender_name'>" + numb + " " + username + "</p><div><div class='left_balloon'>" + msg + "</div><time class='time'>"+ time +"</time></div><p class='clear_balloon'></p></il>");
        }
    }
    if (data.type === "thread" && data.ID === thID) {
        var titleElement = $("<il><div class='card mt-3 mx-3 mb-0 p-3' style='display:inline-block;'><h4 class='m-0'>" + message + "</h4>" + username + " | " + time + "</div><p class='clear_balloon'></p></il>");
        title.replaceWith(titleElement);
    }

    //HTMLに取得したデータを追加する
    messageList.append(messageElement);

    if(type === "resu"){

        var newElement = $("<il><div class='card my-1 p-3' style='display:inline-block;'>" + username + " | <time class='time'>" + time + "</time><p id='resu'>" + message + "<br><a class='name' href='thread.html?t="+ ID +"'>元スレ</a></p></div><p class='clear_balloon'></p></il>");
        newList.prepend(newElement);
    }
    

    //一番下にスクロールする
    $('#scroller').scrollTop($('#messages').height());
});

