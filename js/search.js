var q = getParam('q');
if (q == null) {
  q = '';
}
var tab = getParam('tab');
var catParam = getParam('cat');
var occParam = getParam('occ');
var page = 1;
var perPage = 6;

function matchPeople() {
  var text = q.toLowerCase().replace('@', '').trim();
  var result = [];
  var everyone = getAllPeople();
  for (var i = 0; i < everyone.length; i++) {
    var p = everyone[i];
    if (text == '' || p.name.toLowerCase().indexOf(text) > -1 || p.username.toLowerCase().indexOf(text) > -1) {
      result.push(p);
    }
  }
  return result;
}

function newSearch() {
  var text = document.getElementById('searchInput').value.trim();
  window.location.href = 'search.html?q=' + encodeURIComponent(text) + '&tab=' + tab;
  return false;
}

function setTab(name) {
  tab = name;
  page = 1;
  showTab();
}

function changeFilter() {
  page = 1;
  showGifts();
}

function goPage(n) {
  page = n;
  showGifts();
  window.scrollTo(0, 0);
}

function showTab() {
  var peopleList = matchPeople();
  document.getElementById('tabPeople').textContent = 'People (' + peopleList.length + ')';
  document.getElementById('tabPeople').classList.remove('active');
  document.getElementById('tabGifts').classList.remove('active');
  if (tab == 'people') {
    document.getElementById('tabPeople').classList.add('active');
    document.getElementById('peopleBox').classList.remove('hidden');
    document.getElementById('giftsBox').classList.add('hidden');
    showPeople(peopleList);
  } else {
    document.getElementById('tabGifts').classList.add('active');
    document.getElementById('peopleBox').classList.add('hidden');
    document.getElementById('giftsBox').classList.remove('hidden');
    showGifts();
  }
}

function showPeople(list) {
  var html = '';
  if (list.length == 0) {
    html = '<div class="card center"><h3>No results for \'' + safe(q) + '\'</h3><p class="muted">Check the spelling, or try a shorter name. Search by @username to find a person.</p>';
    html = html + '<p><span class="material-symbols-outlined">auto_awesome</span> Not sure? <a href="advisor.html">Ask the Gift Advisor</a></p></div>';
  }
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    html = html + '<div class="card" style="margin-bottom:12px"><div class="row between"><div class="row"><div class="person-photo" style="width:56px;height:56px;font-size:22px">' + p.name.charAt(0) + '</div>';
    html = html + '<div><b>' + p.name + '</b><div class="muted small">@' + p.username + '</div><div class="small">' + (p.occasions.length > 0 ? p.occasions[0].title + ' · in ' + p.occasions[0].days + ' days' : 'No occasions yet') + '</div></div></div>';
    html = html + '<a class="btn btn-outline" href="wishlist.html?u=' + p.username + '">View wishlist</a></div></div>';
  }
  document.getElementById('peopleBox').innerHTML = html;
}

function getFiltered() {
  var price = document.getElementById('fPrice').value;
  var store = document.getElementById('fStore').value;
  var cat = document.getElementById('fCat').value;
  var sort = document.getElementById('fSort').value;
  var text = q.toLowerCase().trim();
  var list = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var s = findStore(p.sid);
    if (text != '' && p.name.toLowerCase().indexOf(text) == -1 && s.name.toLowerCase().indexOf(text) == -1 && p.cat.toLowerCase().indexOf(text) == -1) {
      continue;
    }
    if (price == 'u100' && p.price >= 100) {
      continue;
    }
    if (price == '100-500' && (p.price < 100 || p.price > 500)) {
      continue;
    }
    if (price == 'o500' && p.price <= 500) {
      continue;
    }
    if (store != 'all' && p.sid != store) {
      continue;
    }
    if (cat != 'all' && p.cat != cat) {
      continue;
    }
    if (occParam && p.occ.indexOf(occParam.toLowerCase()) == -1) {
      continue;
    }
    list.push(p);
  }
  if (sort == 'asc') {
    list.sort(function (a, b) {
      return a.price - b.price;
    });
  } else if (sort == 'desc') {
    list.sort(function (a, b) {
      return b.price - a.price;
    });
  } else if (sort == 'new') {
    list.sort(function (a, b) {
      return b.newest - a.newest;
    });
  } else {
    list.sort(function (a, b) {
      return b.pop - a.pop;
    });
  }
  return list;
}

function showGifts() {
  var list = getFiltered();
  var totalPages = Math.ceil(list.length / perPage);
  if (page > totalPages) {
    page = 1;
  }
  var label = list.length + ' gifts from partner stores';
  if (occParam) {
    label = label + ' for ' + occParam;
  }
  document.getElementById('count').textContent = label;
  var html = '';
  var start = (page - 1) * perPage;
  for (var i = start; i < start + perPage && i < list.length; i++) {
    html = html + productCard(list[i]);
  }
  document.getElementById('grid').innerHTML = html;

  var empty = '';
  if (list.length == 0) {
    empty = '<div class="card center"><h3>No results for \'' + safe(q) + '\'</h3><p class="muted">Check the spelling, or try a product type, like "perfume" or "headphones".</p><p><span class="material-symbols-outlined">auto_awesome</span> Not sure? <a href="advisor.html">Ask the Gift Advisor</a></p></div>';
  }
  document.getElementById('empty').innerHTML = empty;

  var pager = '';
  if (totalPages > 1) {
    pager = '<button class="btn btn-outline btn-small" ' + (page == 1 ? 'disabled' : '') + ' onclick="goPage(' + (page - 1) + ')">Previous</button>';
    pager = pager + '<span>Page ' + page + ' of ' + totalPages + '</span>';
    pager = pager + '<button class="btn btn-outline btn-small" ' + (page == totalPages ? 'disabled' : '') + ' onclick="goPage(' + (page + 1) + ')">Next</button>';
  }
  document.getElementById('pager').innerHTML = pager;
}

var storeOptions = '<option value="all">All stores</option>';
for (var i = 0; i < stores.length; i++) {
  storeOptions = storeOptions + '<option value="' + stores[i].id + '">' + stores[i].name + '</option>';
}
document.getElementById('fStore').innerHTML = storeOptions;
var catOptions = '<option value="all">All categories</option>';
for (var j = 0; j < categories.length; j++) {
  var sel = '';
  if (catParam == categories[j].name) {
    sel = ' selected';
  }
  catOptions = catOptions + '<option' + sel + '>' + categories[j].name + '</option>';
}
document.getElementById('fCat').innerHTML = catOptions;
document.getElementById('searchInput').value = q;

if (tab != 'people' && tab != 'gifts') {
  if (q != '' && matchPeople().length > 0) {
    tab = 'people';
  } else {
    tab = 'gifts';
  }
}

if (q != '') {
  document.getElementById('heading').textContent = "Results for '" + q + "'";
}
if (occParam) {
  document.getElementById('heading').textContent = 'Gifts for ' + occParam;
}
showTab();
