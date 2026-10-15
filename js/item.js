var username = getParam('u');
var index = parseInt(getParam('i'));
var person = findPerson(username);
var mode = getParam('mode');
var amount = 10;
var customAmount = '';
var f = null;
var p = null;

function chooseMode(m) {
  mode = m;
  showGiftBox();
}

function chooseAmount(a) {
  amount = a;
  customAmount = '';
  showGiftBox();
}

function typeCustom() {
  customAmount = document.getElementById('custom').value;
  amount = parseFloat(customAmount);
  var err = document.getElementById('amtErr');
  err.style.display = 'none';
}

function goCheckout() {
  var pay = 0;
  if (mode == 'full') {
    pay = f.remaining;
  } else {
    pay = amount;
    if (isNaN(pay) || pay < 1) {
      var err = document.getElementById('amtErr');
      err.textContent = 'Enter an amount of at least 1 JOD.';
      err.style.display = 'block';
      return;
    }
    if (pay > f.remaining) {
      var err2 = document.getElementById('amtErr');
      err2.textContent = 'The most you can gift is the remaining ' + f.remaining + ' JOD.';
      err2.style.display = 'block';
      return;
    }
  }
  var draft = {
    src: 'wishlist',
    username: username,
    index: index,
    pid: p.id,
    mode: mode,
    amount: pay,
    toName: person.name
  };
  saveData('togiftDraft', draft);
  window.location.href = 'checkout.html';
}

function showGiftBox() {
  var box = document.getElementById('giftBox');
  if (f.status != 'open') {
    var msg = 'This item has already been purchased.';
    if (f.status == 'funded') {
      msg = 'This gift is fully funded and on its way to ' + person.name + '.';
    }
    box.innerHTML = '<h3>' + statusText(f.status) + '</h3><p>' + msg + '</p><a class="btn btn-outline btn-block" href="wishlist.html?u=' + username + '">See other items</a>';
    return;
  }
  var html = '<h3>Group gift</h3>';
  var occ = getPersonOccasion(person, person.items[index].occ);
  if (occ) {
    html = html + '<p class="small muted">Funding ends ' + dateText(addDays(occ.days)) + '</p>';
  }
  html = html + '<div class="bar" style="margin:6px 0"><div style="width:' + f.pct + '%"></div></div>';
  html = html + '<div class="row between"><span><b>' + f.funded + ' of ' + f.goal + ' JOD</b> funded</span><span><b>' + f.remaining + ' JOD</b> remaining</span></div>';
  if (f.people > 0) {
    html = html + '<p class="small muted">Gifted by ' + f.people + ' people' + (f.anon > 0 ? ', ' + f.anon + ' anonymous' : '') + '</p>';
  } else {
    html = html + '<p class="small muted">0 of ' + f.goal + ' JOD funded · be the first to gift part of it</p>';
  }
  html = html + '<p class="small muted">The goal includes delivery. ' + person.name.split(' ')[0] + ' picks the wrapping, and it ships once fully funded.</p>';
  html = html + '<h4 style="margin-top:16px">How would you like to gift?</h4>';

  var fullLabel = 'Gift the full item: ' + f.goal + ' JOD';
  if (f.funded > 0) {
    fullLabel = 'Complete the gift: pay the remaining ' + f.remaining + ' JOD';
  }
  var on = '<span class="material-symbols-outlined">radio_button_checked</span>';
  var off = '<span class="material-symbols-outlined">radio_button_unchecked</span>';
  html = html + '<div class="option' + (mode == 'full' ? ' selected' : '') + '" onclick="chooseMode(\'full\')">' + (mode == 'full' ? on : off) + '<b>' + fullLabel + '</b></div>';
  html = html + '<div class="option' + (mode == 'part' ? ' selected' : '') + '" onclick="chooseMode(\'part\')">' + (mode == 'part' ? on : off) + '<b>Gift part of it</b></div>';

  if (mode == 'part') {
    html = html + '<p class="small"><b>Choose an amount</b></p><div class="chips">';
    var options = [10, 25, 50, 100];
    for (var i = 0; i < options.length; i++) {
      if (options[i] <= f.remaining) {
        var cls = 'chip';
        if (customAmount == '' && amount == options[i]) {
          cls = 'chip selected';
        }
        html = html + '<button class="' + cls + '" onclick="chooseAmount(' + options[i] + ')">' + options[i] + ' JOD</button>';
      }
    }
    html = html + '</div>';
    html = html + '<div class="field" style="margin-top:12px"><label>Custom amount (JOD)</label><input type="number" id="custom" value="' + customAmount + '" oninput="typeCustom()"><div class="error" id="amtErr" style="display:none"></div></div>';
    html = html + '<p class="small muted">If it isn\'t fully funded by ' + (occ ? dateText(addDays(occ.days)) : 'the date') + ', all gifts become togift credit for ' + person.name + '.</p>';
  } else {
    html = html + '<div class="error" id="amtErr" style="display:none"></div>';
  }
  html = html + '<button class="btn btn-block" style="margin-top:10px" onclick="goCheckout()">Continue to checkout</button>';
  html = html + '<p class="small muted center">Delivered by our delivery partner · you earn points</p>';
  box.innerHTML = html;
}

function statusText(s) {
  if (s == 'funded') {
    return 'Fully funded';
  }
  return 'Purchased';
}

if (!person || isNaN(index) || !person.items[index]) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  var item = person.items[index];
  p = findProduct(item.pid);
  f = getItemFunding(username, index);
  var store = findStore(p.sid);
  document.title = p.name + ' - togift';
  if (mode != 'part') {
    mode = 'full';
  }
  var occ2 = getPersonOccasion(person, item.occ);
  document.getElementById('crumbs').innerHTML = '<a href="index.html">Home</a> / <a href="wishlist.html?u=' + username + '">' + person.name + "'s wishlist</a> / " + p.name;
  document.getElementById('imgBox').innerHTML = productImage(p, true);
  var info = '';
  if (item.mostWanted) {
    info = info + '<span class="badge gold"><span class="material-symbols-outlined">favorite</span> Most wanted</span>';
  }
  info = info + '<h2 style="margin-top:6px">' + p.name + '</h2>';
  info = info + '<p>Sold by <a href="store.html?id=' + store.id + '"><b>' + store.name + '</b></a> · ' + p.cat + '</p>';
  info = info + '<div class="price" style="font-size:24px">' + money(p.price) + '</div>';
  info = info + '<p class="muted small">' + deliveryText(p) + ', wrapping optional</p>';
  if (occ2) {
    var cutoff = occ2.days - 3;
    if (cutoff >= 0) {
      info = info + '<div class="notice">Order by <b>' + dateText(addDays(cutoff)) + '</b> to arrive before ' + item.occ + '.</div>';
    } else {
      info = info + '<div class="notice red"><span class="material-symbols-outlined">warning</span> The order cut-off for ' + item.occ + ' has passed. The next available delivery date is ' + dateText(addDays(3)) + '.</div>';
    }
  }
  if (item.note) {
    info = info + '<h4>Note from ' + person.name.split(' ')[0] + '</h4><p>"' + item.note + '"</p>';
  }
  info = info + '<h4>Key specs</h4><ul>';
  for (var s = 0; s < p.specs.length; s++) {
    info = info + '<li>' + p.specs[s] + '</li>';
  }
  info = info + '</ul>';
  document.getElementById('infoBox').innerHTML = info;
  showGiftBox();
}
