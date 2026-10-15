var username = getParam('u');
var person = findPerson(username);
var occFilter = 'All';

function isFollowing() {
  var user = getCurrentUser();
  if (!user) {
    return false;
  }
  for (var i = 0; i < user.following.length; i++) {
    if (user.following[i] == username) {
      return true;
    }
  }
  return false;
}

function updateFollowButton() {
  var btn = document.getElementById('followBtn');
  if (isFollowing()) {
    btn.innerHTML = '<span class="material-symbols-outlined">check</span> Following';
  } else {
    btn.textContent = 'Follow';
  }
}

function toggleFollow() {
  var user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html?next=' + encodeURIComponent('wishlist.html?u=' + username);
    return;
  }
  var newList = [];
  var found = false;
  for (var i = 0; i < user.following.length; i++) {
    if (user.following[i] == username) {
      found = true;
    } else {
      newList.push(user.following[i]);
    }
  }
  if (!found) {
    newList.push(username);
    showToast('You are now following ' + person.name);
  } else {
    showToast('Unfollowed ' + person.name);
  }
  user.following = newList;
  saveCurrentUser(user);
  updateFollowButton();
}

function shareLink() {
  var link = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link);
  }
  showToast('Link copied');
}

function setFilter(name) {
  occFilter = name;
  showFilters();
  showItems();
}

function showFilters() {
  var html = '<button class="chip' + (occFilter == 'All' ? ' selected' : '') + '" onclick="setFilter(\'All\')">All</button>';
  for (var i = 0; i < person.occasions.length; i++) {
    var t = person.occasions[i].title;
    var cls = 'chip';
    if (occFilter == t) {
      cls = 'chip selected';
    }
    html = html + '<button class="' + cls + '" onclick="setFilter(\'' + t + '\')">' + t + '</button>';
  }
  document.getElementById('occFilter').innerHTML = html;
}

function showItems() {
  var sort = document.getElementById('sortBy').value;
  var list = [];
  for (var i = 0; i < person.items.length; i++) {
    var it = person.items[i];
    if (occFilter == 'All' || it.occ == occFilter) {
      list.push({ item: it, index: i, f: getItemFunding(username, i), p: findProduct(it.pid) });
    }
  }
  if (sort == 'price') {
    list.sort(function (a, b) {
      return a.p.price - b.p.price;
    });
  } else if (sort == 'funded') {
    list.sort(function (a, b) {
      var x = a.f.status == 'open' ? a.f.pct : -1;
      var y = b.f.status == 'open' ? b.f.pct : -1;
      return y - x;
    });
  } else {
    list.sort(function (a, b) {
      return (b.item.mostWanted ? 1 : 0) - (a.item.mostWanted ? 1 : 0);
    });
  }

  var infoHtml = '';
  if (occFilter != 'All') {
    var occ = getPersonOccasion(person, occFilter);
    infoHtml = '<div class="notice green">' + occFilter + ' · ' + dateText(addDays(occ.days)) + ' · in ' + occ.days + ' days · ' + list.length + ' items linked</div>';
  }
  document.getElementById('occInfo').innerHTML = infoHtml;

  if (list.length == 0) {
    document.getElementById('itemsBox').innerHTML = '<div class="card center"><h3>No items here yet</h3><p class="muted">' + person.name + ' has not added items for this occasion.</p></div>';
    return;
  }

  var html = '';
  for (var j = 0; j < list.length; j++) {
    var row = list[j];
    var f = row.f;
    var link = 'item.html?u=' + username + '&i=' + row.index;
    html = html + '<div class="item-row">';
    html = html + '<a href="' + link + '">' + productImage(row.p, false) + '</a>';
    html = html + '<div>';
    if (row.item.mostWanted) {
      html = html + '<span class="badge gold"><span class="material-symbols-outlined">favorite</span> Most wanted</span> ';
    }
    html = html + statusBadge(f.status);
    html = html + '<h3 style="margin:6px 0 2px 0"><a href="' + link + '" style="text-decoration:none">' + row.p.name + '</a></h3>';
    html = html + '<div class="muted small">' + findStore(row.p.sid).name + ' · ' + row.item.occ + '</div>';
    html = html + '<div class="price">' + money(row.p.price) + '</div>';
    if (f.status == 'bought') {
      html = html + '<p class="small muted" style="margin:6px 0 0 0">Purchased by ' + person.name.split(' ')[0] + '\'s friends</p>';
    } else if (f.status == 'funded') {
      html = html + '<p class="small" style="margin:6px 0 0 0;color:#1E6B33"><span class="material-symbols-outlined">check</span> Fully funded, on its way</p>';
    } else {
      html = html + '<div class="bar" style="margin:8px 0 4px 0"><div style="width:' + f.pct + '%"></div></div>';
      if (f.funded == 0) {
        html = html + '<div class="small muted">Be the first to gift part of it · goal ' + f.goal + ' JOD</div>';
      } else {
        html = html + '<div class="small muted">' + f.funded + ' of ' + f.goal + ' JOD funded, ' + f.people + ' contributors</div>';
      }
    }
    html = html + '</div>';
    html = html + '<div class="actions">';
    if (f.status == 'open') {
      var label = 'Gift the full item: ' + f.goal + ' JOD';
      if (f.funded > 0) {
        label = 'Complete the gift: pay the remaining ' + f.remaining + ' JOD';
      }
      html = html + '<a class="btn btn-block" style="margin-bottom:8px" href="' + link + '&mode=full">' + label + '</a>';
      html = html + '<a class="btn btn-outline btn-block" href="' + link + '&mode=part">Gift part of it</a>';
    } else {
      html = html + '<a class="btn btn-outline btn-block" href="' + link + '">View item</a>';
    }
    html = html + '</div>';
    html = html + '</div>';
  }
  document.getElementById('itemsBox').innerHTML = html;
}

if (!person) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  document.title = person.name + "'s wishlist - togift";
  document.getElementById('crumbName').textContent = person.name;
  document.getElementById('photo').textContent = person.name.charAt(0);
  document.getElementById('pname').textContent = person.name;
  document.getElementById('pmeta').textContent = '@' + person.username + ' · ' + person.followers + ' followers';
  var badges = '';
  for (var b = 0; b < person.occasions.length; b++) {
    badges = badges + '<span class="badge">' + person.occasions[b].title + ' · ' + dateText(addDays(person.occasions[b].days)) + '</span>';
  }
  document.getElementById('occBadges').innerHTML = badges;
  updateFollowButton();
  showFilters();
  showItems();
}
