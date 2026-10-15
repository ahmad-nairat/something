var p = findProduct(getParam('id'));

function giftIt() {
  saveData('togiftDraft', { src: 'product', pid: p.id });
  window.location.href = 'checkout.html';
}

function closeSheet() {
  document.getElementById('sheet').classList.add('hidden');
}

function openSheet() {
  var user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html?next=' + encodeURIComponent('product.html?id=' + p.id);
    return;
  }
  var html = '<h3>Add to my wishlist</h3><p class="muted">' + p.name + '</p>';
  var full = user.wishlist.length >= 30;
  if (full) {
    html = html + '<div class="notice red">Your wishlist is full (30 items). Remove an item to add a new one.</div><button class="btn btn-outline" onclick="closeSheet()">Close</button>';
    document.getElementById('sheetBox').innerHTML = html;
    document.getElementById('sheet').classList.remove('hidden');
    return;
  }
  for (var i = 0; i < user.wishlist.length; i++) {
    if (user.wishlist[i].pid == p.id) {
      html = html + '<div class="notice">This item is already in your wishlist.</div><button class="btn btn-outline" onclick="closeSheet()">Close</button>';
      document.getElementById('sheetBox').innerHTML = html;
      document.getElementById('sheet').classList.remove('hidden');
      return;
    }
  }
  html = html + '<div class="field"><label>Occasion</label><select id="occ"><option>Anytime</option>';
  for (var j = 0; j < user.occasions.length; j++) {
    html = html + '<option>' + safe(user.occasions[j].title) + '</option>';
  }
  html = html + '</select></div>';
  html = html + '<div class="field"><label>Priority</label><select id="prio"><option>High</option><option selected>Medium</option><option>Low</option></select></div>';
  html = html + '<div class="field"><label>Why do you want it? (optional)</label><input type="text" id="note" maxlength="100"></div>';
  html = html + '<div class="row"><button class="btn" onclick="addToWishlist()">Add item</button><button class="btn btn-outline" onclick="closeSheet()">Cancel</button></div>';
  document.getElementById('sheetBox').innerHTML = html;
  document.getElementById('sheet').classList.remove('hidden');
}

function addToWishlist() {
  var user = getCurrentUser();
  user.wishlist.push({
    pid: p.id,
    priority: document.getElementById('prio').value,
    occ: document.getElementById('occ').value,
    note: document.getElementById('note').value.trim()
  });
  saveCurrentUser(user);
  closeSheet();
  showToast('Added to your wishlist');
}

if (!p) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  var s = findStore(p.sid);
  document.title = p.name + ' - togift';
  document.getElementById('crumbs').innerHTML = '<a href="index.html">Home</a> / <a href="store.html?id=' + s.id + '">' + s.name + '</a> / ' + p.name;
  document.getElementById('imgBox').innerHTML = productImage(p, true);
  document.getElementById('pname').textContent = p.name;
  document.getElementById('sold').innerHTML = 'Sold by <a href="store.html?id=' + s.id + '"><b>' + s.name + '</b></a> · ' + p.cat;
  document.getElementById('pprice').textContent = money(p.price);
  document.getElementById('pdel').textContent = deliveryText(p) + ' · wrapping optional';
  document.getElementById('pnote').textContent = 'Delivered by our delivery partner inside and outside Amman · you earn points';
  var html = '';
  for (var i = 0; i < p.specs.length; i++) {
    html = html + '<li>' + p.specs[i] + '</li>';
  }
  document.getElementById('specs').innerHTML = html;
  document.getElementById('desc').textContent = '[Product description from ' + s.name + ': what it is, what is in the box, and why it makes a good gift.]';
}
