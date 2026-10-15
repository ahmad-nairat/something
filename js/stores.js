var html = '';
for (var i = 0; i < stores.length; i++) {
  var s = stores[i];
  var count = 0;
  for (var j = 0; j < products.length; j++) {
    if (products[j].sid == s.id) {
      count++;
    }
  }
  html = html + '<div class="card">' + storeLogo(s);
  html = html + '<h3 style="margin-top:10px">' + s.name + '</h3>';
  html = html + '<p class="muted small">' + s.cats + ' · ' + count + ' products</p>';
  html = html + '<p>' + s.desc + '</p>';
  html = html + '<a class="btn btn-outline" href="store.html?id=' + s.id + '">Visit store</a></div>';
}
document.getElementById('storeList').innerHTML = html;
