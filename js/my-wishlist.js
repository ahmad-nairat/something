var user = requireLogin();
var suggestions = [];
var picked = [];
var sugRound = 0;

function saveUser() {
  saveCurrentUser(user);
}

function closeSheet() {
  document.getElementById('sheet').classList.add('hidden');
}

function openSheet(html) {
  document.getElementById('sheetBox').innerHTML = html;
  document.getElementById('sheet').classList.remove('hidden');
}

function copyLink() {
  var box = document.getElementById('shareLink');
  if (navigator.clipboard) {
    navigator.clipboard.writeText(box.value);
  }
  showToast('Link copied');
}

function setVisibility(v) {
  user.visibility = v;
  saveUser();
  showVisibility();
}

function showVisibility() {
  var list = ['Public', 'Followers only', 'Private'];
  var html = '';
  for (var i = 0; i < list.length; i++) {
    var cls = 'chip';
    if (user.visibility == list[i]) {
      cls = 'chip selected';
    }
    html = html + '<button class="' + cls + '" onclick="setVisibility(\'' + list[i] + '\')">' + list[i] + '</button>';
  }
  document.getElementById('visChips').innerHTML = html;
}

function showTop() {
  document.getElementById('countText').textContent = user.wishlist.length + ' / 30 items · ' + user.occasions.length + ' occasions';
  document.getElementById('previewBtn').href = 'wishlist.html?u=' + user.username;
  var notice = '';
  if (user.wishlist.length >= 30) {
    notice = '<div class="notice red">Your wishlist is full (30 items). Remove an item to add a new one.</div>';
  }
  document.getElementById('fullNotice').innerHTML = notice;
}

function showOccasions() {
  var html = '';
  if (user.occasions.length == 0) {
    html = '<div class="card center"><p class="muted">No occasions yet. Add one so friends know when to gift.</p></div>';
  }
  for (var i = 0; i < user.occasions.length; i++) {
    var o = user.occasions[i];
    var count = 0;
    for (var j = 0; j < user.wishlist.length; j++) {
      if (user.wishlist[j].occ == o.title) {
        count++;
      }
    }
    html = html + '<div class="card"><b>' + safe(o.title) + '</b><div class="muted small">' + dateText(o.date) + ' · in ' + daysLeftFrom(o.date) + ' days · ' + count + ' items linked</div>';
    html = html + '<div class="row between" style="margin-top:10px"><span class="small">Remind my followers</span><button class="switch' + (o.remind ? ' on' : '') + '" onclick="toggleRemind(' + i + ')" aria-label="Remind my followers"></button></div>';
    html = html + '<div class="row" style="margin-top:10px"><button class="btn-link small" onclick="removeOccasion(' + i + ')">Remove</button></div></div>';
  }
  document.getElementById('occBox').innerHTML = html;
}

function toggleRemind(i) {
  user.occasions[i].remind = !user.occasions[i].remind;
  saveUser();
  showOccasions();
}

function removeOccasion(i) {
  var title = user.occasions[i].title;
  user.occasions.splice(i, 1);
  for (var j = 0; j < user.wishlist.length; j++) {
    if (user.wishlist[j].occ == title) {
      user.wishlist[j].occ = 'Anytime';
    }
  }
  saveUser();
  showAll();
  showToast('Occasion removed');
}

function openAddOccasion() {
  var html = '<h3>Add occasion</h3>';
  html = html + '<div class="field"><label>Occasion</label><select id="oTitle"><option>Birthday</option><option>Wedding</option><option>Graduation</option><option>New home</option><option>New baby</option></select></div>';
  html = html + '<div class="field" id="f_date"><label>Date</label><input type="date" id="oDate"><div class="error">Choose a date in the future.</div></div>';
  html = html + '<div class="row"><button class="btn" onclick="addOccasion()">Add occasion</button><button class="btn btn-outline" onclick="closeSheet()">Cancel</button></div>';
  openSheet(html);
}

function addOccasion() {
  var title = document.getElementById('oTitle').value;
  var date = document.getElementById('oDate').value;
  var field = document.getElementById('f_date');
  if (date == '' || daysLeftFrom(date) < 1) {
    field.classList.add('bad');
    return;
  }
  user.occasions.push({ title: title, date: new Date(date).toISOString(), remind: false });
  saveUser();
  closeSheet();
  showAll();
  showToast('Occasion added');
}

function openAddItem() {
  if (user.wishlist.length >= 30) {
    openSheet('<h3>Your wishlist is full</h3><p>Remove an item to add a new one.</p><button class="btn btn-outline" onclick="closeSheet()">Close</button>');
    return;
  }
  var html = '<h3>Add item</h3>';
  html = html + '<div class="field"><label>Product</label><select id="aProd">';
  for (var i = 0; i < products.length; i++) {
    html = html + '<option value="' + products[i].id + '">' + products[i].name + ' · ' + products[i].price + ' JOD</option>';
  }
  html = html + '</select></div>';
  html = html + '<div class="field"><label>Occasion</label><select id="aOcc"><option>Anytime</option>';
  for (var j = 0; j < user.occasions.length; j++) {
    html = html + '<option>' + safe(user.occasions[j].title) + '</option>';
  }
  html = html + '</select></div>';
  html = html + '<div class="field"><label>Priority</label><select id="aPrio"><option>High</option><option selected>Medium</option><option>Low</option></select></div>';
  html = html + '<div class="notice red hidden" id="dupNotice">This item is already in your wishlist.</div>';
  html = html + '<div class="row"><button class="btn" onclick="addItem()">Add item</button><button class="btn btn-outline" onclick="closeSheet()">Cancel</button></div>';
  openSheet(html);
}

function hasItem(pid) {
  for (var i = 0; i < user.wishlist.length; i++) {
    if (user.wishlist[i].pid == pid) {
      return true;
    }
  }
  return false;
}

function addItem() {
  var pid = document.getElementById('aProd').value;
  if (hasItem(pid)) {
    document.getElementById('dupNotice').classList.remove('hidden');
    return;
  }
  user.wishlist.push({ pid: pid, priority: document.getElementById('aPrio').value, occ: document.getElementById('aOcc').value, note: '' });
  saveUser();
  closeSheet();
  showAll();
  showToast('Item added');
}

function removeItem(i) {
  user.wishlist.splice(i, 1);
  saveUser();
  showAll();
  showToast('Item removed');
}

function changePriority(i, value) {
  user.wishlist[i].priority = value;
  saveUser();
}

function showItems() {
  var html = '';
  for (var i = 0; i < user.wishlist.length; i++) {
    var w = user.wishlist[i];
    var p = findProduct(w.pid);
    html = html + '<tr><td><div class="row" style="flex-wrap:nowrap"><div style="width:64px;flex-shrink:0">' + productImage(p, false) + '</div><div><a href="product.html?id=' + p.id + '"><b>' + p.name + '</b></a><div class="muted small">' + findStore(p.sid).name + ' · ' + money(p.price) + ' · ' + safe(w.occ) + '</div></div></div></td>';
    html = html + '<td><select onchange="changePriority(' + i + ',this.value)" style="padding:6px;border-radius:8px;border:1.5px solid #cfc3b6">';
    var prios = ['High', 'Medium', 'Low'];
    for (var k = 0; k < prios.length; k++) {
      html = html + '<option' + (w.priority == prios[k] ? ' selected' : '') + '>' + prios[k] + '</option>';
    }
    html = html + '</select></td>';
    html = html + '<td><span class="badge">Open</span></td>';
    html = html + '<td><button class="btn-link" onclick="removeItem(' + i + ')">Remove</button></td></tr>';
  }
  document.getElementById('itemRows').innerHTML = html;
  var none = '';
  if (user.wishlist.length == 0) {
    none = '<p class="center muted">Your wishlist is empty. Add your first item, or let the AI suggest some ideas.</p>';
  }
  document.getElementById('noItems').innerHTML = none;
}

function suggest() {
  var occ = document.getElementById('sugOcc').value.toLowerCase();
  var all = [];
  for (var i = 0; i < products.length; i++) {
    if (products[i].occ.indexOf(occ) > -1 && !hasItem(products[i].id)) {
      all.push(products[i]);
    }
  }
  if (all.length == 0) {
    for (var j = 0; j < products.length; j++) {
      if (!hasItem(products[j].id)) {
        all.push(products[j]);
      }
    }
  }
  suggestions = all;
  picked = [];
  sugRound = 0;
  showSuggestions();
}

function showMore() {
  sugRound++;
  if (sugRound * 3 >= suggestions.length) {
    sugRound = 0;
  }
  showSuggestions();
}

function togglePick(id) {
  var pos = picked.indexOf(id);
  if (pos > -1) {
    picked.splice(pos, 1);
  } else {
    picked.push(id);
  }
  showSuggestions();
}

function addPicked() {
  var occ = document.getElementById('sugOcc').value;
  var has = false;
  for (var j = 0; j < user.occasions.length; j++) {
    if (user.occasions[j].title == occ) {
      has = true;
    }
  }
  if (!has) {
    occ = 'Anytime';
  }
  for (var i = 0; i < picked.length; i++) {
    if (user.wishlist.length < 30 && !hasItem(picked[i])) {
      user.wishlist.push({ pid: picked[i], priority: 'Medium', occ: occ, note: '' });
    }
  }
  saveUser();
  picked = [];
  suggestions = [];
  document.getElementById('sugBox').innerHTML = '';
  showAll();
  showToast('Items added to your wishlist');
}

function showSuggestions() {
  var html = '<div style="margin-top:12px">';
  var start = sugRound * 3;
  for (var i = start; i < start + 3 && i < suggestions.length; i++) {
    var p = suggestions[i];
    var on = picked.indexOf(p.id) > -1;
    var box = on ? 'check_box' : 'check_box_outline_blank';
    html = html + '<div class="option' + (on ? ' selected' : '') + '" onclick="togglePick(\'' + p.id + '\')"><span class="material-symbols-outlined">' + box + '</span><img src="' + p.img + '" alt="" style="width:48px;height:48px;object-fit:contain;background:#fff;border-radius:6px"><div style="flex:1"><b>' + p.name + '</b><div class="small muted">' + findStore(p.sid).name + ' · ' + money(p.price) + '</div></div></div>';
  }
  html = html + '<div class="row"><button class="btn btn-small" onclick="addPicked()"' + (picked.length == 0 ? ' disabled' : '') + '>Add selected (' + picked.length + ')</button><button class="btn btn-outline btn-small" onclick="showMore()">Show more ideas</button></div></div>';
  document.getElementById('sugBox').innerHTML = html;
}

function showAll() {
  showTop();
  showOccasions();
  showItems();
}

if (user) {
  document.getElementById('shareLink').value = window.location.origin + window.location.pathname.replace('my-wishlist.html', '') + 'wishlist.html?u=' + user.username;
  showVisibility();
  showAll();
}
