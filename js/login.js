var next = getParam('next');
if (next && next.indexOf('//') > -1) {
  next = null;
}

function fillDemo() {
  document.getElementById('email').value = 'hind@togift.com';
  document.getElementById('pw').value = 'password123';
}

function showPassword() {
  var box = document.getElementById('pw');
  if (box.type == 'password') {
    box.type = 'text';
    document.getElementById('showBtn').textContent = 'Hide';
  } else {
    box.type = 'password';
    document.getElementById('showBtn').textContent = 'Show';
  }
}

function showForgot() {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('forgotBox').classList.remove('hidden');
}

function showLogin() {
  document.getElementById('forgotBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');
}

function sendReset() {
  var email = document.getElementById('femail').value.trim();
  var field = document.getElementById('f_femail');
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    field.classList.add('bad');
    return;
  }
  field.classList.remove('bad');
  document.getElementById('sent').classList.remove('hidden');
}

function login() {
  var email = document.getElementById('email').value.trim().toLowerCase();
  var pw = document.getElementById('pw').value;
  var f1 = document.getElementById('f_email');
  var f2 = document.getElementById('f_pw');
  f1.classList.remove('bad');
  f2.classList.remove('bad');
  var bad = false;
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    f1.classList.add('bad');
    bad = true;
  }
  if (pw == '') {
    document.getElementById('pwErr').textContent = 'Enter your password.';
    f2.classList.add('bad');
    bad = true;
  }
  if (bad) {
    return;
  }
  var list = getUsers();
  var found = null;
  for (var i = 0; i < list.length; i++) {
    if (list[i].email == email && list[i].password == pw) {
      found = list[i];
    }
  }
  if (!found) {
    document.getElementById('pwErr').textContent = 'Wrong email or password. Try again.';
    f2.classList.add('bad');
    return;
  }
  localStorage.setItem('togiftSession', found.email);
  if (next) {
    window.location.href = next;
  } else {
    window.location.href = 'index.html';
  }
}

if (next) {
  var reason = document.getElementById('reason');
  reason.style.display = 'block';
  reason.textContent = 'Log in to continue.';
}
