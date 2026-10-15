var chosen = [];

function showChips() {
  var html = '';
  var all = ['Electronics & home appliances', 'Beauty & care', 'Fashion', 'Toys & kids', 'Food & sweets', 'Books & stationery'];
  for (var i = 0; i < all.length; i++) {
    var cls = 'chip';
    if (chosen.indexOf(all[i]) > -1) {
      cls = 'chip selected';
    }
    html = html + '<button type="button" class="' + cls + '" onclick="toggleCat(\'' + all[i] + '\')">' + all[i] + '</button>';
  }
  document.getElementById('catChips').innerHTML = html;
}

function toggleCat(name) {
  var pos = chosen.indexOf(name);
  if (pos > -1) {
    chosen.splice(pos, 1);
  } else {
    chosen.push(name);
  }
  showChips();
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

function submitForm() {
  var bad = 0;
  if (setBad('f_store', document.getElementById('store').value.trim() == '')) {
    bad++;
  }
  if (setBad('f_owner', document.getElementById('owner').value.trim() == '')) {
    bad++;
  }
  if (setBad('f_email', !/^\S+@\S+\.\S+$/.test(document.getElementById('email').value.trim()))) {
    bad++;
  }
  if (setBad('f_phone', !/^07\d{8}$/.test(document.getElementById('phone').value.replace(/\s/g, '')))) {
    bad++;
  }
  if (setBad('f_cats', chosen.length == 0)) {
    bad++;
  }
  if (setBad('f_desc', document.getElementById('desc').value.trim().length < 20)) {
    bad++;
  }
  if (setBad('f_terms', !document.getElementById('terms').checked)) {
    bad++;
  }
  if (bad > 0) {
    return;
  }
  var apps = getData('togiftApplications', []);
  apps.push({
    store: document.getElementById('store').value.trim(),
    owner: document.getElementById('owner').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    cats: chosen,
    desc: document.getElementById('desc').value.trim()
  });
  saveData('togiftApplications', apps);
  document.getElementById('formBox').classList.add('hidden');
  document.getElementById('doneBox').classList.remove('hidden');
  document.getElementById('doneText').textContent = "We'll review your application within 3 days and email you at " + document.getElementById('email').value.trim() + '.';
  window.scrollTo(0, 0);
}

showChips();
