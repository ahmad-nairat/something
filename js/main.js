function getData(key, fallback) {
  var s = localStorage.getItem(key);
  if (s == null) {
    return fallback;
  }
  return JSON.parse(s);
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function safe(text) {
  text = String(text);
  text = text.replace(/&/g, '&amp;');
  text = text.replace(/</g, '&lt;');
  text = text.replace(/>/g, '&gt;');
  text = text.replace(/"/g, '&quot;');
  return text;
}

function findProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      return products[i];
    }
  }
  return null;
}

function findStore(id) {
  for (var i = 0; i < stores.length; i++) {
    if (stores[i].id == id) {
      return stores[i];
    }
  }
  return null;
}

function userToPerson(u) {
  var occs = [];
  for (var i = 0; i < u.occasions.length; i++) {
    occs.push({ title: u.occasions[i].title, days: daysLeftFrom(u.occasions[i].date) });
  }
  var items = [];
  for (var j = 0; j < u.wishlist.length; j++) {
    var w = u.wishlist[j];
    items.push({ pid: w.pid, occ: w.occ, mostWanted: w.priority == 'High', status: 'open', funded: 0, people: 0, note: w.note });
  }
  return { username: u.username, name: u.name, followers: 0, occasions: occs, items: items };
}

function findPerson(username) {
  for (var i = 0; i < people.length; i++) {
    if (people[i].username == username) {
      return people[i];
    }
  }
  var users = getUsers();
  for (var j = 0; j < users.length; j++) {
    if (users[j].username == username) {
      return userToPerson(users[j]);
    }
  }
  return null;
}

function getAllPeople() {
  var list = people.slice();
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    var already = false;
    for (var j = 0; j < list.length; j++) {
      if (list[j].username == users[i].username) {
        already = true;
      }
    }
    if (!already && users[i].visibility != 'Private') {
      list.push(userToPerson(users[i]));
    }
  }
  return list;
}

function addDays(n) {
  var d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function dateText(d) {
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  d = new Date(d);
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function daysLeftFrom(dateString) {
  var d = new Date(dateString);
  var now = new Date();
  return Math.ceil((d - now) / 86400000);
}

function money(n) {
  return (Math.round(n * 100) / 100) + ' JOD';
}

function deliveryText(p) {
  if (p.delivery == 0) {
    return 'Free delivery';
  }
  return 'Delivery from ' + money(p.delivery);
}

function getPersonOccasion(person, title) {
  for (var i = 0; i < person.occasions.length; i++) {
    if (person.occasions[i].title == title) {
      return person.occasions[i];
    }
  }
  return null;
}

function itemGoal(pid) {
  var p = findProduct(pid);
  return p.price + p.delivery;
}

function getItemFunding(username, index) {
  var person = findPerson(username);
  var item = person.items[index];
  var extra = getData('togiftContribs', {});
  var key = username + ':' + index;
  var funded = item.funded;
  var count = item.people;
  var anon = 0;
  if (extra[key]) {
    funded = funded + extra[key].funded;
    count = count + extra[key].people;
    anon = extra[key].anon;
  }
  var goal = itemGoal(item.pid);
  var status = item.status;
  if (status == 'open' && funded >= goal) {
    status = 'funded';
  }
  var pct = Math.round(funded / goal * 100);
  if (pct > 100) {
    pct = 100;
  }
  if (status == 'bought' || status == 'funded') {
    pct = 100;
  }
  var remaining = goal - funded;
  if (remaining < 0) {
    remaining = 0;
  }
  return { goal: goal, funded: funded, people: count, anon: anon, status: status, pct: pct, remaining: remaining };
}

function addContribution(username, index, amount, anonymous) {
  var extra = getData('togiftContribs', {});
  var key = username + ':' + index;
  if (!extra[key]) {
    extra[key] = { funded: 0, people: 0, anon: 0 };
  }
  extra[key].funded = extra[key].funded + amount;
  extra[key].people = extra[key].people + 1;
  if (anonymous) {
    extra[key].anon = extra[key].anon + 1;
  }
  saveData('togiftContribs', extra);
}

function getUsers() {
  return getData('togiftUsers', []);
}

function saveUsers(list) {
  saveData('togiftUsers', list);
}

function getCurrentUser() {
  var email = localStorage.getItem('togiftSession');
  if (!email) {
    return null;
  }
  var list = getUsers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == email) {
      return list[i];
    }
  }
  return null;
}

function saveCurrentUser(user) {
  var list = getUsers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == user.email) {
      list[i] = user;
    }
  }
  saveUsers(list);
}

function seedData() {
  if (localStorage.getItem('togiftVersion') != '2') {
    localStorage.clear();
    localStorage.setItem('togiftVersion', '2');
  }
  var list = getUsers();
  var found = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == 'hind@togift.com') {
      found = true;
    }
  }
  if (!found) {
    list.push({
      name: 'Hind Bondouq',
      username: 'hind.b',
      email: 'hind@togift.com',
      password: 'password123',
      bio: 'Coffee lover and planner of surprises.',
      birthday: '',
      city: 'Amman',
      phone: '0792130062',
      address: 'Marj Alhamam, Street 12, Building 4',
      notes: '',
      visibility: 'Public',
      allowAnon: true,
      points: 240,
      credit: 12,
      wishlist: [
        { pid: 'tease-sugar', priority: 'High', occ: 'Graduation', note: '' },
        { pid: 'iphone', priority: 'Medium', occ: 'Graduation', note: '' }
      ],
      occasions: [{ title: 'Graduation', date: addDays(35).toISOString() }],
      following: ['zain.b']
    });
    saveUsers(list);
  }
  if (!localStorage.getItem('togiftNotifs')) {
    saveData('togiftNotifs', [
      { text: 'Zain Bondouq added 2 items to the birthday wishlist.', read: false },
      { text: 'Saba Izraqi has a birthday in 2 days. Order soon.', read: false },
      { text: 'Welcome to ToGift! Make your wishlist to get started.', read: true }
    ]);
  }
}

function showToast(text) {
  var old = document.getElementById('toast');
  if (old) {
    old.remove();
  }
  var t = document.createElement('div');
  t.className = 'toast';
  t.id = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(function () {
    t.remove();
  }, 2600);
}

function toggleMenu() {
  document.getElementById('nav').classList.toggle('open');
}

function requireLogin() {
  var user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html?next=' + encodeURIComponent(window.location.pathname.split('/').pop() + window.location.search);
    return null;
  }
  return user;
}

function headerSearch() {
  var q = document.getElementById('headerQ').value.trim();
  window.location.href = 'search.html?q=' + encodeURIComponent(q);
  return false;
}

function closeDropdowns() {
  var a = document.getElementById('notifBox');
  var b = document.getElementById('avatarBox');
  if (a) {
    a.classList.add('hidden');
  }
  if (b) {
    b.classList.add('hidden');
  }
}

function toggleNotif() {
  var box = document.getElementById('notifBox');
  var wasHidden = box.classList.contains('hidden');
  closeDropdowns();
  if (wasHidden) {
    box.classList.remove('hidden');
  }
}

function toggleAvatar() {
  var box = document.getElementById('avatarBox');
  var wasHidden = box.classList.contains('hidden');
  closeDropdowns();
  if (wasHidden) {
    box.classList.remove('hidden');
  }
}

function markAllRead() {
  var list = getData('togiftNotifs', []);
  for (var i = 0; i < list.length; i++) {
    list[i].read = true;
  }
  saveData('togiftNotifs', list);
  setupHeader();
}

function logout() {
  localStorage.removeItem('togiftSession');
  window.location.href = 'index.html';
}

function setupHeader() {
  var box = document.getElementById('headerRight');
  var user = getCurrentUser();
  if (!user) {
    box.innerHTML = '<a href="login.html" class="btn btn-outline btn-small">Log in</a><a href="signup.html" class="btn btn-small">Sign up</a>';
    return;
  }
  var list = getData('togiftNotifs', []);
  var unread = 0;
  var notifHtml = '';
  for (var i = 0; i < list.length; i++) {
    if (!list[i].read) {
      unread++;
    }
    var cls = 'notif-item';
    if (!list[i].read) {
      cls = 'notif-item unread';
    }
    notifHtml = notifHtml + '<div class="' + cls + '">' + safe(list[i].text) + '</div>';
  }
  var dot = '';
  if (unread > 0) {
    dot = '<span class="dot"></span>';
  }
  var html = '';
  html = html + '<a href="my-gifts.html" class="points-pill"><span class="material-symbols-outlined">star</span> ' + user.points + ' pts</a>';
  html = html + '<button class="icon-btn" onclick="toggleNotif()" aria-label="Notifications"><span class="material-symbols-outlined">notifications</span>' + dot + '</button>';
  html = html + '<div class="dropdown hidden" id="notifBox"><div class="row between" style="padding:6px 12px"><b>Notifications</b><button class="btn-link small" onclick="markAllRead()">Mark all read</button></div>' + notifHtml + '</div>';
  html = html + '<button class="avatar" onclick="toggleAvatar()" aria-label="Account menu">' + safe(user.name.charAt(0)) + '</button>';
  html = html + '<div class="dropdown hidden" id="avatarBox">';
  html = html + '<div style="padding:8px 12px"><b>' + safe(user.name) + '</b><div class="muted small">@' + safe(user.username) + '</div></div>';
  html = html + '<a href="my-wishlist.html">My wishlist</a>';
  html = html + '<a href="my-gifts.html">My gifts and credit</a>';
  html = html + '<a href="orders.html">My orders</a>';
  html = html + '<a href="settings.html">Settings</a>';
  html = html + '<button class="menu-item" onclick="logout()">Log out</button>';
  html = html + '</div>';
  box.innerHTML = html;
}

function setupHelp() {
  var btn = document.createElement('button');
  btn.className = 'help-btn';
  btn.innerHTML = '<span class="material-symbols-outlined">help</span> Help';
  btn.onclick = toggleHelp;
  document.body.appendChild(btn);
  var panel = document.createElement('div');
  panel.className = 'help-panel hidden';
  panel.id = 'helpPanel';
  document.body.appendChild(panel);
}

function toggleHelp() {
  var panel = document.getElementById('helpPanel');
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    showHelpStart();
  }
}

function showHelpStart() {
  var panel = document.getElementById('helpPanel');
  var html = '<div class="help-head"><b>Help assistant</b><button class="btn-link" style="color:#fff" onclick="toggleHelp()">Close</button></div>';
  html = html + '<div class="help-body"><p style="margin-top:0">Hi! What do you need help with?</p>';
  for (var i = 0; i < helpAnswers.length; i++) {
    html = html + '<button class="q" onclick="showHelpAnswer(' + i + ')">' + helpAnswers[i].q + '</button>';
  }
  html = html + '</div>';
  panel.innerHTML = html;
}

function showHelpAnswer(i) {
  var panel = document.getElementById('helpPanel');
  var html = '<div class="help-head"><b>Help assistant</b><button class="btn-link" style="color:#fff" onclick="toggleHelp()">Close</button></div>';
  html = html + '<div class="help-body"><div class="bubble me">' + helpAnswers[i].q + '</div>';
  html = html + '<div class="bubble bot">' + helpAnswers[i].a + '</div>';
  html = html + '<p class="small muted">Was this helpful?</p>';
  html = html + '<div class="row"><button class="btn btn-small btn-outline" onclick="helpFeedback(true)">Yes</button><button class="btn btn-small btn-outline" onclick="helpFeedback(false)">No</button></div>';
  html = html + '<p><button class="btn-link" onclick="showHelpStart()">Back to questions</button></p></div>';
  panel.innerHTML = html;
}

function helpFeedback(yes) {
  if (yes) {
    showToast('Thanks for your feedback!');
  } else {
    showToast('Sorry about that. Please try the Gift Advisor or email support.');
  }
}

function storeLogo(s) {
  return '<div class="logo-box" style="background:' + s.logoBg + '"><img src="' + s.logo + '" alt="' + s.name + '"></div>';
}

function productImage(p, big) {
  var cls = 'pimg';
  if (big) {
    cls = 'pimg big';
  }
  return '<div class="' + cls + '"><img src="' + p.img + '" alt="' + safe(p.name) + '"></div>';
}

function productCard(p) {
  var s = findStore(p.sid);
  var html = '<a class="pcard" href="product.html?id=' + p.id + '">';
  html = html + productImage(p, false);
  html = html + '<h4>' + p.name + '</h4>';
  html = html + '<span class="muted small">' + s.name + '</span>';
  html = html + '<span class="price">' + money(p.price) + '</span>';
  html = html + '</a>';
  return html;
}

function statusBadge(status) {
  if (status == 'funded') {
    return '<span class="badge green">Fully funded</span>';
  }
  if (status == 'bought') {
    return '<span class="badge gray">Purchased</span>';
  }
  return '<span class="badge">Open</span>';
}

function getOrders() {
  return getData('togiftOrders', []);
}

function saveOrders(list) {
  saveData('togiftOrders', list);
}

function addNotification(text) {
  var list = getData('togiftNotifs', []);
  list.unshift({ text: text, read: false });
  saveData('togiftNotifs', list);
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.header-right')) {
    closeDropdowns();
  }
});

seedData();
setupHeader();
setupHelp();
