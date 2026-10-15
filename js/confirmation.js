var orderId = getParam('id');
var orders = getOrders();
var order = null;
for (var i = 0; i < orders.length; i++) {
  if (orders[i].id == orderId) {
    order = orders[i];
  }
}

function saveOrder() {
  var list = getOrders();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id == order.id) {
      list[i] = order;
    }
  }
  saveOrders(list);
}

function toggleReveal() {
  order.reveal = !order.reveal;
  saveOrder();
  showAnon();
}

function showAnon() {
  var box = document.getElementById('anonBox');
  if (!order.anon) {
    box.innerHTML = '';
    return;
  }
  var first = order.toName.split(' ')[0];
  var html = '<div class="card" style="margin-bottom:16px"><h3>You sent this anonymously</h3>';
  html = html + '<p class="muted">' + first + ' sees "Someone special" instead of your name. ToGift keeps your identity private.</p>';
  html = html + '<div class="row between"><div><b>Reveal my name later</b><div class="small muted">We will show ' + first + ' your name after the gift is delivered. You can change this from Track order until then.</div></div>';
  html = html + '<button class="switch' + (order.reveal ? ' on' : '') + '" onclick="toggleReveal()" aria-label="Reveal my name later"></button></div>';
  if (order.reveal) {
    html = html + '<div class="notice green"><span class="material-symbols-outlined">check</span> Your name will be revealed to ' + first + ' after delivery.</div>';
  }
  html = html + '</div>';
  box.innerHTML = html;
}

function inviteOthers() {
  var link = window.location.origin + window.location.pathname.replace('confirmation.html', '') + 'wishlist.html?u=' + order.toUser;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link);
  }
  showToast('Invite link copied');
}

function createAccount() {
  var pw = document.getElementById('pw').value;
  var box = document.getElementById('pwField');
  if (pw.length < 8) {
    box.classList.add('bad');
    return;
  }
  var list = getUsers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == order.buyer) {
      document.getElementById('pwErr').textContent = 'An account with this email already exists. Please log in.';
      box.classList.add('bad');
      return;
    }
  }
  var base = order.buyer.split('@')[0];
  var name = base.charAt(0).toUpperCase() + base.slice(1);
  var username = base.toLowerCase().replace(/[^a-z0-9._]/g, '');
  var used = true;
  var n = 0;
  var tryName = username;
  while (used) {
    used = false;
    for (var j = 0; j < list.length; j++) {
      if (list[j].username == tryName) {
        used = true;
      }
    }
    if (used) {
      n++;
      tryName = username + n;
    }
  }
  var newUser = {
    name: name,
    username: tryName,
    email: order.buyer,
    password: pw,
    bio: '',
    birthday: '',
    city: '',
    phone: '',
    address: '',
    notes: '',
    visibility: 'Public',
    allowAnon: true,
    points: Math.floor(order.amount),
    credit: 0,
    wishlist: [],
    occasions: [],
    following: []
  };
  list.push(newUser);
  saveUsers(list);
  localStorage.setItem('togiftSession', newUser.email);
  order.guest = false;
  order.earned = Math.floor(order.amount);
  saveOrder();
  setupHeader();
  showAccount();
}

function showAccount() {
  var box = document.getElementById('accountBox');
  var user = getCurrentUser();
  if (user) {
    if (order.earned > 0) {
      box.innerHTML = '<div class="card"><h3 style="color:#8a6212"><span class="material-symbols-outlined">star</span> You earned ' + order.earned + ' points.</h3><p>Balance: ' + user.points + ' pts</p><a class="btn btn-outline" href="my-gifts.html">See my points</a></div>';
    } else {
      box.innerHTML = '';
    }
    return;
  }
  var html = '<div class="card"><h3><span class="material-symbols-outlined">star</span> Create an account to earn ' + Math.floor(order.amount) + ' points</h3>';
  html = html + '<p class="muted">Save this order, track it, and get points on every gift. Just add a password.</p>';
  html = html + '<div class="field"><label>Email</label><input type="email" value="' + safe(order.buyer) + '" disabled></div>';
  html = html + '<div class="field" id="pwField"><label>Create a password</label><input type="password" id="pw"><div class="hint">At least 8 characters.</div><div class="error" id="pwErr">Password must be at least 8 characters.</div></div>';
  html = html + '<div class="row"><button class="btn" onclick="createAccount()">Create account and earn points</button><button class="btn btn-outline" onclick="document.getElementById(\'accountBox\').innerHTML=\'\'">No thanks</button></div></div>';
  box.innerHTML = html;
}

if (!order) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  var first = order.toName.split(' ')[0];
  if (order.type == 'Group gift') {
    document.getElementById('title').textContent = 'Thank you for gifting part of it!';
  } else {
    document.getElementById('title').textContent = 'Your gift is on its way to ' + first;
  }
  document.getElementById('sub').textContent = 'Order ' + order.id + ' · Receipt sent to ' + order.buyer;
  document.getElementById('trackBtn').href = 'tracking.html?id=' + order.id;
  var next = '';
  if (order.type == 'Group gift') {
    var left = order.funding.goal - order.funding.funded;
    next = '<p>1. Your gift of ' + money(order.amount) + ' is added to the group gift.</p><p>2. ' + money(left) + ' is still needed. We order the item once it is fully funded.</p><p>3. We email you at every step.</p>';
    document.getElementById('inviteBtn').classList.remove('hidden');
  } else {
    next = '<p>1. ' + order.productName + ' is prepared by the store.</p><p>2. We wrap it and our delivery partner brings it to ' + first + '.</p><p>3. We email you when it is on its way.</p>';
  }
  document.getElementById('nextBox').innerHTML = next;
  if (order.toUser) {
    var back = document.getElementById('backBtn');
    back.classList.remove('hidden');
    back.href = 'wishlist.html?u=' + order.toUser;
    back.textContent = "Back to " + first + "'s wishlist";
  }
  showAnon();
  showAccount();
}
