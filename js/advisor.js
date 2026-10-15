var chats = getData('togiftChats', []);
var current = null;
var confirmDelete = false;
var justDeleted = false;

function saveChats() {
  saveData('togiftChats', chats);
}

function newChat() {
  current = null;
  confirmDelete = false;
  justDeleted = false;
  document.getElementById('msgInput').value = '';
  showAll();
}

function openChat(id) {
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].id == id) {
      current = chats[i];
    }
  }
  confirmDelete = false;
  justDeleted = false;
  showAll();
}

function guessOccasion(text) {
  text = text.toLowerCase();
  if (text.indexOf('hospital') > -1 || text.indexOf('surgery') > -1 || text.indexOf('sick') > -1 || text.indexOf('get well') > -1) {
    return 'Get well soon';
  }
  if (text.indexOf('birthday') > -1) {
    return 'Birthday';
  }
  if (text.indexOf('wedding') > -1 || text.indexOf('married') > -1) {
    return 'Wedding';
  }
  if (text.indexOf('graduat') > -1) {
    return 'Graduation';
  }
  if (text.indexOf('thank') > -1) {
    return 'Thank you';
  }
  return 'Just because';
}

function guessPlace(text) {
  text = text.toLowerCase();
  if (text.indexOf('hospital') > -1) {
    return 'Hospital';
  }
  if (text.indexOf('office') > -1 || text.indexOf('colleague') > -1 || text.indexOf('work') > -1) {
    return 'Office';
  }
  return 'Home';
}

function guessBudget(text) {
  var m = text.match(/(\d+)/);
  if (m) {
    return parseInt(m[1]);
  }
  return 100;
}

function sendMessage() {
  var box = document.getElementById('msgInput');
  var text = box.value.trim();
  if (text == '') {
    return false;
  }
  var chat = {
    id: Date.now(),
    text: text,
    occ: guessOccasion(text),
    budget: guessBudget(text),
    place: guessPlace(text),
    feedback: null
  };
  chats.unshift(chat);
  saveChats();
  current = chat;
  confirmDelete = false;
  justDeleted = false;
  box.value = '';
  showAll();
  return false;
}

function ideasFor(chat) {
  var list = [];
  var rest = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.price + p.delivery <= chat.budget) {
      if (p.occ.indexOf(chat.occ.toLowerCase()) > -1) {
        list.push(p);
      } else {
        rest.push(p);
      }
    }
  }
  list.sort(function (a, b) {
    return b.price - a.price;
  });
  rest.sort(function (a, b) {
    return b.pop - a.pop;
  });
  var all = list.concat(rest);
  return all.slice(0, 3);
}

function setOcc(name) {
  current.occ = name;
  showChat();
}

function setPlace(name) {
  current.place = name;
  showChat();
}

function updateIdeas() {
  var b = parseInt(document.getElementById('budgetInput').value);
  if (isNaN(b) || b < 1) {
    document.getElementById('budgetErr').style.display = 'block';
    return;
  }
  current.budget = b;
  current.updated = true;
  saveChats();
  showAll();
}

function giveFeedback(value) {
  current.feedback = value;
  saveChats();
  showChat();
}

function giftIt(pid) {
  saveData('togiftDraft', { src: 'advisor', pid: pid, occasion: current.occ, place: current.place });
  window.location.href = 'checkout.html';
}

function askDelete() {
  confirmDelete = true;
  showChat();
}

function cancelDelete() {
  confirmDelete = false;
  showChat();
}

function deleteChat() {
  var newList = [];
  for (var i = 0; i < chats.length; i++) {
    if (chats[i].id != current.id) {
      newList.push(chats[i]);
    }
  }
  chats = newList;
  saveChats();
  current = null;
  confirmDelete = false;
  justDeleted = true;
  showAll();
}

function showPast() {
  var html = '';
  for (var i = 0; i < chats.length; i++) {
    var title = chats[i].text;
    if (title.length > 32) {
      title = title.substring(0, 32) + '...';
    }
    html = html + '<button onclick="openChat(' + chats[i].id + ')">' + safe(title) + '</button>';
  }
  if (chats.length == 0) {
    html = '<p class="small muted">No chats yet.</p>';
  }
  document.getElementById('pastChats').innerHTML = html;
}

function showChat() {
  var box = document.getElementById('chatBox');
  if (!current) {
    if (justDeleted) {
      box.innerHTML = '<div class="card center"><h3>Chat deleted</h3><p class="muted">Describe someone and your budget to start again.</p><button class="btn btn-ai" onclick="newChat()">Start a new chat</button></div>';
    } else {
      box.innerHTML = '<div class="card center"><div style="font-size:40px"><span class="material-symbols-outlined">auto_awesome</span></div><h3>Who are you gifting?</h3><p class="muted">Tell me about the person, the occasion and your budget. I will suggest gifts from our partner stores.</p></div>';
    }
    return;
  }
  var html = '<div class="bubble me">' + safe(current.text) + '</div>';
  html = html + '<div class="bubble bot" style="max-width:100%"><b><span class="material-symbols-outlined">auto_awesome</span> What I understood</b> <span class="muted small">— change anything that\'s wrong</span>';
  html = html + '<p class="small" style="margin-bottom:4px"><b>Occasion</b></p><div class="chips">';
  var occs = ['Get well soon', 'Thank you', 'Just because', 'Birthday', 'Wedding', 'Graduation'];
  for (var i = 0; i < occs.length; i++) {
    html = html + '<button class="chip' + (current.occ == occs[i] ? ' selected' : '') + '" onclick="setOcc(\'' + occs[i] + '\')">' + occs[i] + '</button>';
  }
  html = html + '</div>';
  html = html + '<div class="field" style="margin-top:12px;max-width:220px"><label>Budget (JOD, up to)</label><input type="number" id="budgetInput" value="' + current.budget + '"><div class="error" id="budgetErr">Enter a budget of at least 1 JOD.</div></div>';
  html = html + '<p class="small" style="margin-bottom:4px"><b>Deliver to</b></p><div class="chips">';
  var places = ['Hospital', 'Home', 'Office'];
  for (var j = 0; j < places.length; j++) {
    html = html + '<button class="chip' + (current.place == places[j] ? ' selected' : '') + '" onclick="setPlace(\'' + places[j] + '\')">' + places[j] + '</button>';
  }
  html = html + '</div>';
  html = html + '<p><button class="btn btn-ai btn-small" onclick="updateIdeas()">Update ideas</button></p></div>';

  if (current.updated) {
    html = html + '<div class="notice green">Ideas updated for ' + current.occ + ', up to ' + current.budget + ' JOD, to ' + current.place + '.</div>';
  }

  var ideas = ideasFor(current);
  if (ideas.length == 0) {
    html = html + '<div class="bubble bot">I could not find a gift within ' + current.budget + ' JOD. Try raising the budget a little.</div>';
  }
  for (var k = 0; k < ideas.length; k++) {
    var p = ideas[k];
    var why = 'Within your budget of ' + current.budget + ' JOD.';
    if (p.occ.indexOf(current.occ.toLowerCase()) > -1) {
      why = 'A good fit for "' + current.occ + '" and within your budget of ' + current.budget + ' JOD.';
    }
    html = html + '<div class="card" style="margin-bottom:12px"><div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div style="width:100px;flex-shrink:0">' + productImage(p, false) + '</div><div style="flex:1">';
    html = html + '<b>' + p.name + '</b><div class="muted small">' + findStore(p.sid).name + ' · <span class="price">' + money(p.price) + '</span></div>';
    html = html + '<p class="small" style="margin:6px 0"><b>Why:</b> ' + why + '</p>';
    html = html + '<div class="small muted">' + p.specs[0] + ' · ' + p.specs[1] + '</div>';
    html = html + '<div class="small muted">' + deliveryText(p) + '</div>';
    html = html + '<div class="row" style="margin-top:8px"><button class="btn btn-small" onclick="giftIt(\'' + p.id + '\')">Gift it</button><a class="btn btn-outline btn-small" href="product.html?id=' + p.id + '">View</a></div>';
    html = html + '</div></div></div>';
  }

  if (ideas.length > 0) {
    html = html + '<div class="row"><span class="small muted">Was this helpful?</span>';
    if (current.feedback == null) {
      html = html + '<button class="btn btn-outline btn-small" onclick="giveFeedback(true)">Yes</button><button class="btn btn-outline btn-small" onclick="giveFeedback(false)">No</button>';
    } else if (current.feedback) {
      html = html + '<span class="badge green">Thanks for the feedback!</span>';
    } else {
      html = html + '<span class="badge">Thanks. Try changing the occasion or budget above.</span>';
    }
    html = html + '</div>';
  }

  if (confirmDelete) {
    html = html + '<div class="notice red" style="margin-top:16px"><b>Delete this chat?</b> It\'s removed from your history for good.<div class="row" style="margin-top:8px"><button class="btn btn-small" onclick="deleteChat()">Delete</button><button class="btn btn-small btn-outline" onclick="cancelDelete()">Cancel</button></div></div>';
  } else {
    html = html + '<p><button class="btn-link small" onclick="askDelete()">Delete chat</button></p>';
  }
  box.innerHTML = html;
}

function showAll() {
  showPast();
  showChat();
}

var q = getParam('q');
if (q) {
  document.getElementById('msgInput').value = q;
  sendMessage();
} else {
  showAll();
}
