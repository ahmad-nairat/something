var heroMode = 'find';

function switchTab(mode) {
  heroMode = mode;
  var input = document.getElementById('heroInput');
  var btn = document.getElementById('heroBtn');
  var hint = document.getElementById('heroHint');
  document.getElementById('tabFind').classList.remove('active');
  document.getElementById('tabIdeas').classList.remove('active');
  if (mode == 'find') {
    document.getElementById('tabFind').classList.add('active');
    input.placeholder = 'Search by name or @username';
    btn.textContent = 'Search';
    hint.textContent = 'Try "Zain", "@ahmad.n" or "Saba".';
  } else {
    document.getElementById('tabIdeas').classList.add('active');
    input.placeholder = 'Describe the person and your budget';
    btn.textContent = 'Get gift ideas';
    hint.textContent = 'Example: my colleague is in hospital, budget 100 JOD';
  }
}

function heroSearch() {
  var text = document.getElementById('heroInput').value.trim();
  if (heroMode == 'find') {
    window.location.href = 'search.html?q=' + encodeURIComponent(text) + '&tab=people';
  } else {
    window.location.href = 'advisor.html?q=' + encodeURIComponent(text);
  }
  return false;
}

function showFeatured() {
  var person = findPerson('ahmad.n');
  var item = person.items[0];
  var p = findProduct(item.pid);
  var f = getItemFunding('ahmad.n', 0);
  document.getElementById('featTitle').textContent = person.name + "'s wedding wishlist";
  var html = '';
  html = html + productImage(p, false);
  html = html + '<h3 style="margin-top:10px">' + p.name + '</h3>';
  html = html + '<div class="price">' + money(p.price) + '</div>';
  html = html + '<div class="bar" style="margin:10px 0"><div style="width:' + f.pct + '%"></div></div>';
  html = html + '<p class="small muted">' + f.funded + ' of ' + f.goal + ' JOD funded, ' + f.people + ' friends gifted part of it</p>';
  html = html + '<a class="btn btn-block" href="wishlist.html?u=ahmad.n">View wishlist</a>';
  document.getElementById('featBody').innerHTML = html;
}

function showComingUp() {
  var html = '';
  for (var i = 0; i < people.length; i++) {
    var person = people[i];
    var occ = person.occasions[0];
    html = html + '<div class="card">';
    html = html + '<div class="row"><div class="person-photo" style="width:56px;height:56px;font-size:22px">' + person.name.charAt(0) + '</div>';
    html = html + '<div><b>' + person.name + '</b><div class="muted small">@' + person.username + '</div></div></div>';
    html = html + '<p>' + occ.title + ' · in ' + occ.days + ' days</p>';
    html = html + '<a class="btn btn-outline btn-block" href="wishlist.html?u=' + person.username + '">View wishlist</a>';
    html = html + '</div>';
  }
  document.getElementById('comingUp').innerHTML = html;
}

function showPopular() {
  var list = products.slice();
  list.sort(function (a, b) {
    return b.pop - a.pop;
  });
  var html = '';
  for (var i = 0; i < 8; i++) {
    html = html + productCard(list[i]);
  }
  document.getElementById('popularGrid').innerHTML = html;
}

function showCategories() {
  var html = '';
  for (var i = 0; i < categories.length; i++) {
    html = html + '<a class="cat-card" href="search.html?tab=gifts&cat=' + encodeURIComponent(categories[i].name) + '"><span class="e material-symbols-outlined">' + categories[i].icon + '</span>' + categories[i].name + '</a>';
  }
  document.getElementById('catGrid').innerHTML = html;
}

function showOccasions() {
  var html = '';
  for (var i = 0; i < occasionsList.length; i++) {
    html = html + '<a class="cat-card" href="search.html?tab=gifts&occ=' + encodeURIComponent(occasionsList[i].name) + '"><span class="e material-symbols-outlined">' + occasionsList[i].icon + '</span>' + occasionsList[i].name + '</a>';
  }
  document.getElementById('occGrid').innerHTML = html;
}

function showStores() {
  var html = '';
  for (var i = 0; i < stores.length; i++) {
    html = html + '<a class="store-card" href="store.html?id=' + stores[i].id + '">' + storeLogo(stores[i]) + '</a>';
  }
  document.getElementById('storeGrid').innerHTML = html;
}

showFeatured();
showComingUp();
showPopular();
showCategories();
showOccasions();
showStores();
