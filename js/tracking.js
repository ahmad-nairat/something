var orderId = getParam('id');
var order = null;
var allOrders = getOrders();
for (var i = 0; i < allOrders.length; i++) {
  if (allOrders[i].id == orderId) {
    order = allOrders[i];
  }
}
var stepLabels = ['Order placed', 'Preparing your gift', 'Out for delivery', 'Delivered'];

function saveOrder() {
  var list = getOrders();
  for (var i = 0; i < list.length; i++) {
    if (list[i].id == order.id) {
      list[i] = order;
    }
  }
  saveOrders(list);
}

function advance() {
  if (order.status < 3) {
    order.status = order.status + 1;
    saveOrder();
    if (order.status == 3) {
      addNotification('Order ' + order.id + ' was delivered to ' + order.toName + '.');
      setupHeader();
    }
    showAll();
  }
}

function toggleReveal() {
  order.reveal = !order.reveal;
  saveOrder();
  showAll();
}

function sendProblem() {
  var text = document.getElementById('problem').value.trim();
  var field = document.getElementById('probField');
  if (text == '') {
    field.classList.add('bad');
    return;
  }
  field.classList.remove('bad');
  document.getElementById('problem').value = '';
  showToast('Sent. Our team will contact you soon.');
}

function showAll() {
  var html = '';
  for (var i = 0; i < stepLabels.length; i++) {
    var cls = 'tl-item';
    var mark = i + 1;
    if (i < order.status) {
      cls = 'tl-item done';
      mark = '<span class="material-symbols-outlined">check</span>';
    } else if (i == order.status) {
      cls = 'tl-item current';
    }
    if (order.status == 3 && i == 3) {
      cls = 'tl-item done';
      mark = '<span class="material-symbols-outlined">check</span>';
    }
    html = html + '<div class="' + cls + '"><div class="tl-dot">' + mark + '</div><div>' + stepLabels[i] + '</div></div>';
  }
  document.getElementById('timeline').innerHTML = html;
  if (order.status == 3) {
    document.getElementById('demoBtn').classList.add('hidden');
  }

  var d = '';
  d = d + '<div class="sum-row"><span class="muted">Item</span><span>' + order.productName + '</span></div>';
  d = d + '<div class="sum-row"><span class="muted">Recipient</span><span>' + safe(order.toName) + '</span></div>';
  d = d + '<div class="sum-row"><span class="muted">Gift type</span><span>' + order.type + '</span></div>';
  d = d + '<div class="sum-row"><span class="muted">Wrapping</span><span>' + order.wrap + '</span></div>';
  d = d + '<div class="sum-row"><span class="muted">Deliver to</span><span>' + safe(order.address) + '</span></div>';
  d = d + '<div class="sum-row total"><span>Total paid</span><span>' + money(order.amount) + '</span></div>';
  document.getElementById('details').innerHTML = d;

  var fund = '';
  if (order.funding) {
    var p = Math.round(order.funding.funded / order.funding.goal * 100);
    if (p > 100) {
      p = 100;
    }
    fund = '<div class="card" style="margin-bottom:16px"><h3>Group gift funding</h3><p class="small muted">Funding ends ' + order.funding.ends + '</p><div class="bar"><div style="width:' + p + '%"></div></div><p class="small">' + order.funding.funded + ' of ' + order.funding.goal + ' JOD funded · ships once fully funded</p></div>';
  }
  document.getElementById('fundBox').innerHTML = fund;

  var anon = '';
  if (order.anon) {
    var first = order.toName.split(' ')[0];
    anon = '<div class="card"><div class="row between"><div><b>Reveal my name later</b><div class="small muted">Sent anonymously. We will show ' + first + ' your name after delivery.</div></div>';
    if (order.status < 3) {
      anon = anon + '<button class="switch' + (order.reveal ? ' on' : '') + '" onclick="toggleReveal()" aria-label="Reveal my name later"></button>';
    }
    anon = anon + '</div></div>';
  }
  document.getElementById('anonBox').innerHTML = anon;
}

if (!order) {
  document.getElementById('page').classList.add('hidden');
  document.getElementById('notFound').classList.remove('hidden');
} else {
  document.getElementById('crumbId').textContent = order.id;
  document.getElementById('oTitle').textContent = 'Order ' + order.id;
  document.getElementById('oDate').textContent = 'Placed on ' + dateText(order.placed);
  showAll();
}
