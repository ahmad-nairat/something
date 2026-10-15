function usernameTaken(name) {
  var list = getUsers();
  for (var i = 0; i < list.length; i++) {
    if (list[i].username == name) {
      return true;
    }
  }
  for (var j = 0; j < people.length; j++) {
    if (people[j].username == name) {
      return true;
    }
  }
  return false;
}

function checkUsername() {
  var name = document.getElementById('username').value.trim().toLowerCase();
  document.getElementById('linkName').textContent = name || 'username';
  var box = document.getElementById('avail');
  var field = document.getElementById('f_username');
  field.classList.remove('bad');
  if (name == '') {
    box.classList.add('hidden');
    return;
  }
  if (!/^[a-z0-9._]{3,20}$/.test(name)) {
    box.classList.add('hidden');
    document.getElementById('userErr').textContent = 'Use 3 to 20 letters, numbers, dots or underscores.';
    field.classList.add('bad');
    return;
  }
  if (usernameTaken(name)) {
    box.classList.add('hidden');
    document.getElementById('userErr').textContent = '@' + name + ' is already taken.';
    field.classList.add('bad');
    return;
  }
  box.innerHTML = '<span class="material-symbols-outlined">check</span> @' + name + ' is available';
  box.classList.remove('hidden');
}

function setBad(id, bad) {
  var el = document.getElementById(id);
  if (bad) {
    el.classList.add('bad');
  } else {
    el.classList.remove('bad');
  }
  return bad;
}

function createAccount() {
  var name = document.getElementById('name').value.trim();
  var username = document.getElementById('username').value.trim().toLowerCase();
  var email = document.getElementById('email').value.trim().toLowerCase();
  var pw = document.getElementById('pw').value;
  var bad = 0;
  if (setBad('f_name', name == '')) {
    bad++;
  }
  if (!/^[a-z0-9._]{3,20}$/.test(username)) {
    document.getElementById('userErr').textContent = 'Use 3 to 20 letters, numbers, dots or underscores.';
    setBad('f_username', true);
    bad++;
  } else if (usernameTaken(username)) {
    document.getElementById('userErr').textContent = '@' + username + ' is already taken.';
    setBad('f_username', true);
    bad++;
  }
  var list = getUsers();
  var emailUsed = false;
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == email) {
      emailUsed = true;
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    document.getElementById('emailErr').textContent = 'Enter an email like name@example.com.';
    setBad('f_email', true);
    bad++;
  } else if (emailUsed) {
    document.getElementById('emailErr').textContent = 'This email already has an account. Log in instead.';
    setBad('f_email', true);
    bad++;
  } else {
    setBad('f_email', false);
  }
  if (setBad('f_pw', pw.length < 8)) {
    bad++;
  }
  if (setBad('f_terms', !document.getElementById('terms').checked)) {
    bad++;
  }
  if (bad > 0) {
    return;
  }
  var user = {
    name: name,
    username: username,
    email: email,
    password: pw,
    bio: '',
    birthday: document.getElementById('birthday').value,
    city: '',
    phone: '',
    address: '',
    notes: '',
    visibility: 'Public',
    allowAnon: true,
    points: 0,
    credit: 0,
    wishlist: [],
    occasions: [],
    following: []
  };
  list.push(user);
  saveUsers(list);
  localStorage.setItem('togiftSession', email);
  setupHeader();
  document.getElementById('formBox').classList.add('hidden');
  document.getElementById('welcome').classList.remove('hidden');
  document.getElementById('welcomeTitle').textContent = 'Welcome to ToGift, ' + name.split(' ')[0] + '!';
  window.scrollTo(0, 0);
}
