var user = requireLogin();

function setBad(id, bad) {
  var el = document.getElementById(id);
  if (bad) {
    el.classList.add('bad');
  } else {
    el.classList.remove('bad');
  }
  return bad;
}

function flash(id) {
  document.getElementById(id).classList.remove('hidden');
  setTimeout(function () {
    document.getElementById(id).classList.add('hidden');
  }, 2500);
}

function saveProfile() {
  var name = document.getElementById('name').value.trim();
  var username = document.getElementById('username').value.trim().toLowerCase();
  var bio = document.getElementById('bio').value;
  var bad = 0;
  if (setBad('f_name', name == '')) {
    bad++;
  }
  var okName = /^[a-z0-9._]{3,20}$/.test(username);
  if (setBad('f_username', !okName)) {
    document.getElementById('userErr').textContent = 'Use 3 to 20 letters, numbers, dots or underscores.';
    bad++;
  }
  if (okName && username != user.username) {
    var list = getUsers();
    var taken = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i].username == username) {
        taken = true;
      }
    }
    for (var j = 0; j < people.length; j++) {
      if (people[j].username == username) {
        taken = true;
      }
    }
    if (taken) {
      document.getElementById('userErr').textContent = '@' + username + ' is already taken.';
      setBad('f_username', true);
      bad++;
    }
  }
  if (setBad('f_bio', bio.length > 120)) {
    bad++;
  }
  if (bad > 0) {
    return;
  }
  user.name = name;
  user.username = username;
  user.bio = bio.trim();
  saveCurrentUser(user);
  setupHeader();
  document.getElementById('photo').textContent = name.charAt(0);
  document.getElementById('linkName').textContent = username;
  flash('ok1');
}

function saveAddress() {
  var city = document.getElementById('city').value.trim();
  var phone = document.getElementById('phone').value.replace(/\s/g, '');
  var address = document.getElementById('address').value.trim();
  var bad = 0;
  if (setBad('f_city', city == '')) {
    bad++;
  }
  if (setBad('f_phone', !/^07\d{8}$/.test(phone))) {
    bad++;
  }
  if (setBad('f_address', address == '')) {
    bad++;
  }
  if (bad > 0) {
    return;
  }
  user.city = city;
  user.phone = phone;
  user.address = address;
  user.notes = document.getElementById('notes').value.trim();
  saveCurrentUser(user);
  flash('ok2');
}

function saveVisibility() {
  user.visibility = document.getElementById('visibility').value;
  saveCurrentUser(user);
  showToast('Visibility updated');
}

function showAnonSwitch() {
  var sw = document.getElementById('anonSwitch');
  if (user.allowAnon) {
    sw.classList.add('on');
  } else {
    sw.classList.remove('on');
  }
}

function toggleAnon() {
  user.allowAnon = !user.allowAnon;
  saveCurrentUser(user);
  showAnonSwitch();
}

function savePassword() {
  var cur = document.getElementById('cur').value;
  var newpw = document.getElementById('newpw').value;
  var conf = document.getElementById('conf').value;
  var bad = 0;
  if (setBad('f_cur', cur != user.password)) {
    bad++;
  }
  if (setBad('f_new', newpw.length < 8)) {
    bad++;
  }
  if (setBad('f_conf', conf != newpw)) {
    bad++;
  }
  if (bad > 0) {
    return;
  }
  user.password = newpw;
  saveCurrentUser(user);
  document.getElementById('cur').value = '';
  document.getElementById('newpw').value = '';
  document.getElementById('conf').value = '';
  flash('ok3');
}

if (user) {
  document.getElementById('who').textContent = user.email;
  document.getElementById('photo').textContent = user.name.charAt(0);
  document.getElementById('name').value = user.name;
  document.getElementById('username').value = user.username;
  document.getElementById('linkName').textContent = user.username;
  document.getElementById('bio').value = user.bio;
  document.getElementById('city').value = user.city;
  document.getElementById('phone').value = user.phone;
  document.getElementById('address').value = user.address;
  document.getElementById('notes').value = user.notes;
  document.getElementById('visibility').value = user.visibility;
  showAnonSwitch();
}
