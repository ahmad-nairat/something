var store = findStore(getParam('id'));
var page = 1;
var perPage = 6;

function changeFilter() {
  page = 1;
  showProducts();
}

function goPage(n) {
  page = n;
  showProducts();
}

function showProducts() {
  var price = document.getElementById('fPrice').value;
  var sort = document.getElementById('fSort').value;
  var list = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    if (p.sid != store.id) {
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
  document.getElementById('count').textContent = list.length + ' products';
  var totalPages = Math.ceil(list.length / perPage);
  var html = '';
  for (var j = (page - 1) * perPage; j < page * perPage && j < list.length; j++) {
    html = html + productCard(list[j]);
  }
  document.getElementById('grid').innerHTML = html;
  var empty = '';
  if (list.length == 0) {
    empty = '<div class="card center"><h3>No products here yet</h3><p class="muted">Try a different price range, or browse other partner stores.</p><a class="btn" href="stores.html">Browse stores</a></div>';
  }
  document.getElementById('empty').innerHTML = empty;
  var pager = '';
  if (totalPages > 1) {
    pager = '<button class="btn btn-outline btn-small" ' + (page == 1 ? 'disabled' : '') + ' onclick="goPage(' + (page - 1) + ')">Previous</button><span>Page ' + page + ' of ' + totalPages + '</span><button class="btn btn-outline btn-small" ' + (page == totalPages ? 'disabled' : '') + ' onclick="goPage(' + (page + 1) + ')">Next</button>';
  }
  document.getElementById('pager').innerHTML = pager;
}

if (!store) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  document.title = store.name + ' - togift';
  document.getElementById('crumbName').textContent = store.name;
  document.getElementById('logo').innerHTML = storeLogo(store);
  document.getElementById('sname').textContent = store.name;
  document.getElementById('sdesc').textContent = store.desc;
  showProducts();
}
