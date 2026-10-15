var user = requireLogin();
var statusLabels = ['Order placed', 'Preparing', 'Out for delivery', 'Delivered'];

if (user) {
  var all = getOrders();
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].buyer == user.email) {
      mine.push(all[i]);
    }
  }
  var html = '';
  if (mine.length == 0) {
    html = '<div class="card center"><h3>No orders yet</h3><p class="muted">When you send a gift, it shows up here.</p><a class="btn" href="index.html">Find a gift</a></div>';
  }
  for (var j = 0; j < mine.length; j++) {
    var o = mine[j];
    var badge = 'badge';
    if (o.status == 3) {
      badge = 'badge green';
    }
    html = html + '<div class="card" style="margin-bottom:14px"><div class="row between"><div><b>' + o.productName + '</b><div class="muted small">Order ' + o.id + ' · ' + dateText(o.placed) + ' · to ' + safe(o.toName) + '</div></div>';
    html = html + '<div class="row"><span class="' + badge + '">' + statusLabels[o.status] + '</span><a class="btn btn-outline btn-small" href="tracking.html?id=' + o.id + '">Track order</a></div></div></div>';
  }
  document.getElementById('list').innerHTML = html;
}
