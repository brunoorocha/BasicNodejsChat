window.onload = function(){
  var textarea        = document.getElementById('speak'),
      bubbleArea      = document.getElementById('bubble-area'),
      usersOnlineList = document.getElementById('users-online-list'),
      loginForm       = document.getElementById('login-form');

  var nickname;
  var socket = io();

  loginForm.onsubmit = function(e){
    e.preventDefault();
    nickname = document.getElementById('nickname').value;

    socket.emit('add user', nickname);
    document.getElementById('login').className += ' hide';
    textarea.focus();
  };

  textarea.addEventListener('keypress', function(e){
    if(this.value != '' && e.which == 13){
      var msg = {"nickname": nickname, "txt": this.value};

      socket.emit('chat message', msg);
      this.value = null;
    }
  });

  socket.on('chat message', function(msg){
    addMessage(msg);
  });

  socket.on('list users', function(usersOnline){
    removeElementsByClass('user-online');

    for(id in usersOnline){
      if(usersOnline[id] != nickname){
        var userOnline = document.createElement('div');

        userOnline.className = 'user-online';
        userOnline.innerHTML = usersOnline[id];

        usersOnlineList.appendChild(userOnline);
      }
    }


  });

  socket.on('join', function(usernick){
    if(usernick != nickname){
      var chatRow = document.createElement('div');

      chatRow.className = 'chat-row';
      chatRow.innerHTML = '<div class="join">'+ usernick +' entrou na conversa</div>';
      bubbleArea.appendChild(chatRow);
    }
  });

  socket.on('exit', function(usernick){
    if(usernick != nickname){
      var chatRow = document.createElement('div');

      chatRow.className = 'chat-row';
      chatRow.innerHTML = '<div class="join">'+ usernick +' saiu da conversa</div>';
      bubbleArea.appendChild(chatRow);
    }
  });


  function addMessage(msg){
    var chatRow = document.createElement('div');

    chatRow.className = 'chat-row';

    if(msg.nickname == nickname){
      chatRow.innerHTML = '<div class="chat-bubble me">'+ msg.txt +'</div>';
    }else{
      chatRow.innerHTML = '<div class="chat-bubble">'+ msg.txt +'</div><span class="user-name">'+ msg.nickname +'</span>';
    }

    bubbleArea.appendChild(chatRow);
  }

  function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
    }
  }
}
