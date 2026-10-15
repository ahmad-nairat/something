var draft = getData('togiftDraft', null);
var user = getCurrentUser();
var product = null;
var stepNames = [];
var stepIndex = 0;
var errs = {};
var tried = false;

var s = {
  message: '',
  wrap: 0,
  anon: false,
  reveal: false,
  recip: 'user',
  recipUser: 'zain.b',
  rName: '',
  rPhone: '',
  addrType: 'hospital',
  hosp: '',
  ward: '',
  room: '',
  city: '',
  street: '',
  email: '',
  card: '',
  exp: '',
  cvc: '',
  cname: '',
  usePoints: false,
  useCredit: false,
  occasion: 'Birthday',
  tone: 'Warm',
  suggestion: -1,
  prevMessage: null
};

var suggestions = {
  Warm: [
    'Thinking of you and hoping each day feels a bit better than the last. Enjoy this little gift!',
    'Wishing you all the happiness you deserve. This is just a small way to say I care.',
    'You mean a lot to me. I hope this brings a smile to your face today.'
  ],
  Funny: [
    'I looked for a gift as great as you but they were out of stock, so I got this instead!',
    'No refunds, no returns, only smiles. Enjoy!',
    'I promise it is better than socks. (Unless it is socks.)'
  ],
  Formal: [
    'Please accept this gift with our warmest regards and best wishes on this occasion.',
    'It is with great pleasure that I send you this gift. Congratulations and best wishes.',
    'With sincere appreciation and the very best wishes.'
  ],
  'Short and sweet': [
    'Enjoy this one, you deserve it!',
    'Thinking of you. Enjoy!',
    'Congrats and best wishes!'
  ]
};

function recipientName() {
  if (draft.src == 'wishlist') {
    return draft.toName;
  }
  if (s.recip == 'user') {
    return findPerson(s.recipUser).name;
  }
  if (s.rName.trim() != '') {
    return s.rName.trim();
  }
  return 'someone outside ToGift';
}

function baseAmount() {
  if (draft.src == 'wishlist') {
    return draft.amount;
  }
  return product.price + product.delivery + wrappingOptions[s.wrap].price;
}

function pointsDiscount() {
  if (!user || !s.usePoints) {
    return 0;
  }
  var d = Math.floor(user.points / 100);
  var base = baseAmount();
  if (d > base - 1) {
    d = Math.floor(base - 1);
  }
  if (d < 0) {
    d = 0;
  }
  return d;
}

function creditDiscount() {
  if (!user || !s.useCredit) {
    return 0;
  }
  var left = baseAmount() - pointsDiscount() - 1;
  var d = user.credit;
  if (d > left) {
    d = left;
  }
  if (d < 0) {
    d = 0;
  }
  return d;
}

function totalAmount() {
  return baseAmount() - pointsDiscount() - creditDiscount();
}

function field(key, label, type, hint, placeholder) {
  var cls = 'field';
  var msg = '';
  if (tried && errs[key]) {
    cls = 'field bad';
    msg = errs[key];
  }
  var html = '<div class="' + cls + '"><label>' + label + '</label>';
  html = html + '<input type="' + type + '" value="' + safe(s[key]) + '" placeholder="' + (placeholder || '') + '" oninput="s[\'' + key + '\']=this.value">';
  if (hint) {
    html = html + '<div class="hint">' + hint + '</div>';
  }
  html = html + '<div class="error">' + msg + '</div></div>';
  return html;
}

function validate(name) {
  var e = {};
  if (name == 'Delivery' && s.recip == 'outside') {
    if (s.rName.trim() == '') {
      e.rName = "Enter the recipient's name.";
    }
    var phone = s.rPhone.replace(/\s/g, '');
    if (!/^07\d{8}$/.test(phone)) {
      e.rPhone = 'Enter a 10-digit Jordanian mobile number starting with 07.';
    }
    if (s.addrType == 'hospital') {
      if (s.hosp.trim() == '') {
        e.hosp = 'Enter the hospital name.';
      }
      if (s.room.trim() == '') {
        e.room = 'Enter the room number so the driver can find them.';
      }
    } else {
      if (s.city.trim() == '') {
        e.city = 'Enter the city.';
      }
      if (s.street.trim() == '') {
        e.street = 'Enter the area, street and building.';
      }
    }
  }
  if (name == 'Payment') {
    if (!user && !/^\S+@\S+\.\S+$/.test(s.email.trim())) {
      e.email = 'Enter an email like name@example.com.';
    }
    if (!/^\d{16}$/.test(s.card.replace(/\s/g, ''))) {
      e.card = 'Card number must be 16 digits.';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(s.exp.trim())) {
      e.exp = 'Use the format MM/YY, e.g. 08/28.';
    }
    if (!/^\d{3}$/.test(s.cvc.trim())) {
      e.cvc = 'Enter the 3 digits on the back of the card.';
    }
    if (s.cname.trim() == '') {
      e.cname = 'Enter the name as it appears on the card.';
    }
  }
  return e;
}

function nextStep() {
  var name = stepNames[stepIndex];
  errs = validate(name);
  var count = 0;
  for (var k in errs) {
    count++;
  }
  if (count > 0) {
    tried = true;
    render();
    return;
  }
  tried = false;
  if (name == 'Payment') {
    placeOrder();
    return;
  }
  stepIndex++;
  render();
  window.scrollTo(0, 0);
}

function prevStep() {
  tried = false;
  stepIndex--;
  render();
}

function setValue(key, value) {
  s[key] = value;
  render();
}

function countChars() {
  var box = document.getElementById('msg');
  s.message = box.value;
  document.getElementById('count').textContent = box.value.length;
  updatePreview();
}

function updatePreview() {
  var el = document.getElementById('previewMsg');
  if (el) {
    el.textContent = s.message || 'Your message will appear here.';
  }
}

function generateMessage() {
  var list = suggestions[s.tone];
  s.suggestion = s.suggestion + 1;
  if (s.suggestion >= list.length) {
    s.suggestion = 0;
  }
  render();
}

function useSuggestion() {
  s.prevMessage = s.message;
  s.message = suggestions[s.tone][s.suggestion];
  s.suggestion = -1;
  render();
}

function undoMessage() {
  s.message = s.prevMessage;
  s.prevMessage = null;
  render();
}

function fillTestCard() {
  s.card = '4242 4242 4242 4242';
  s.exp = '08/28';
  s.cvc = '123';
  if (user) {
    s.cname = user.name;
  } else {
    s.cname = 'Test User';
  }
  render();
}

function toggleAnon() {
  s.anon = !s.anon;
  if (!s.anon) {
    s.reveal = false;
  }
  render();
}

function icon(name) {
  return '<span class="material-symbols-outlined">' + name + '</span>';
}

function radio(on) {
  if (on) {
    return icon('radio_button_checked');
  }
  return icon('radio_button_unchecked');
}

function checkbox(on) {
  if (on) {
    return icon('check_box');
  }
  return icon('check_box_outline_blank');
}

function messageStep() {
  var html = '<h3>Gift card message</h3>';
  html = html + '<div class="field"><label>Your message (optional) <span class="muted small"><span id="count">' + s.message.length + '</span> / 250</span></label>';
  html = html + '<textarea id="msg" rows="4" maxlength="250" oninput="countChars()">' + safe(s.message) + '</textarea></div>';
  if (s.prevMessage !== null) {
    html = html + '<div class="notice">Your message was replaced. <button class="btn-link" onclick="undoMessage()">Undo</button></div>';
  }

  html = html + '<div class="ai-box"><b>' + icon('auto_awesome') + ' AI message helper</b><div class="row" style="margin-top:10px">';
  html = html + '<select onchange="s.occasion=this.value" style="padding:8px;border-radius:8px">';
  var occs = ['Birthday', 'Wedding', 'Get well soon', 'Thank you', 'Just because'];
  for (var i = 0; i < occs.length; i++) {
    html = html + '<option' + (s.occasion == occs[i] ? ' selected' : '') + '>' + occs[i] + '</option>';
  }
  html = html + '</select>';
  html = html + '<select onchange="s.tone=this.value;s.suggestion=-1" style="padding:8px;border-radius:8px">';
  for (var t in suggestions) {
    html = html + '<option' + (s.tone == t ? ' selected' : '') + '>' + t + '</option>';
  }
  html = html + '</select>';
  html = html + '<button class="btn btn-ai btn-small" onclick="generateMessage()">' + icon('auto_awesome') + ' Generate</button></div>';
  if (s.suggestion >= 0) {
    html = html + '<div class="card" style="margin-top:10px"><div class="small muted">SUGGESTION ' + (s.suggestion + 1) + '</div><p>' + suggestions[s.tone][s.suggestion] + '</p>';
    html = html + '<button class="btn btn-small" onclick="useSuggestion()">Use this</button> <button class="btn btn-small btn-outline" onclick="generateMessage()">Try another</button></div>';
  }
  html = html + '<p class="small muted" style="margin-bottom:0">Suggestions never change your message unless you choose "Use this".</p></div>';

  if (draft.src != 'wishlist') {
    html = html + '<h3>Wrapping</h3>';
    for (var w = 0; w < wrappingOptions.length; w++) {
      var o = wrappingOptions[w];
      var priceText = 'Free';
      if (o.price > 0) {
        priceText = '+' + o.price + ' JOD';
      }
      html = html + '<div class="option' + (s.wrap == w ? ' selected' : '') + '" onclick="setValue(\'wrap\',' + w + ')">' + radio(s.wrap == w) + '<div style="flex:1">' + o.name + '</div><b>' + priceText + '</b></div>';
    }
  }

  html = html + '<h3 style="margin-top:20px">Your name on the gift</h3>';
  html = html + '<div class="row between"><div><b>Send anonymously</b><div class="muted small">' + recipientName().split(' ')[0] + ' will see "Someone special" instead of your name. ToGift keeps your identity private.</div></div>';
  html = html + '<button class="switch' + (s.anon ? ' on' : '') + '" onclick="toggleAnon()" aria-label="Send anonymously"></button></div>';
  if (s.anon) {
    html = html + '<div class="row between" style="margin-top:12px"><div><b>Reveal my name later</b><div class="muted small">We will show your name after the gift is delivered.</div></div>';
    html = html + '<button class="switch' + (s.reveal ? ' on' : '') + '" onclick="s.reveal=!s.reveal;render()" aria-label="Reveal my name later"></button></div>';
  }
  var from = 'Someone special';
  if (!s.anon) {
    from = user ? user.name : 'A friend';
  }
  html = html + '<div class="card-preview"><div class="small muted">CARD PREVIEW</div><b>To ' + recipientName() + ' ' + icon('favorite') + '</b><p id="previewMsg" style="margin:6px 0">' + safe(s.message || 'Your message will appear here.') + '</p><div class="small">From: ' + safe(from) + '</div></div>';
  return html;
}

function deliveryStep() {
  var html = '<h3>Who is it for?</h3>';
  html = html + '<div class="option' + (s.recip == 'user' ? ' selected' : '') + '" onclick="setValue(\'recip\',\'user\')">' + radio(s.recip == 'user') + 'Someone on togift</div>';
  html = html + '<div class="option' + (s.recip == 'outside' ? ' selected' : '') + '" onclick="setValue(\'recip\',\'outside\')">' + radio(s.recip == 'outside') + 'Someone outside togift</div>';
  if (s.recip == 'user') {
    html = html + '<div class="field" style="margin-top:12px"><label>Choose a person</label><select onchange="setValue(\'recipUser\',this.value)">';
    for (var i = 0; i < people.length; i++) {
      html = html + '<option value="' + people[i].username + '"' + (s.recipUser == people[i].username ? ' selected' : '') + '>' + people[i].name + ' (@' + people[i].username + ')</option>';
    }
    html = html + '</select></div>';
    html = html + '<div class="notice green">' + icon('lock') + ' Delivering to ' + findPerson(s.recipUser).name + "'s saved address. The address is hidden for privacy. Our delivery partner receives it directly.</div>";
    return html;
  }
  html = html + '<div style="margin-top:14px">';
  html = html + field('rName', "Recipient's full name", 'text', '', '');
  html = html + field('rPhone', "Recipient's mobile number", 'text', 'Used only by the delivery company.', '07XXXXXXXX');
  html = html + '<h4>Delivery address</h4><div class="chips" style="margin-bottom:12px">';
  html = html + '<button class="chip' + (s.addrType == 'hospital' ? ' selected' : '') + '" onclick="setValue(\'addrType\',\'hospital\')">Hospital</button>';
  html = html + '<button class="chip' + (s.addrType == 'home' ? ' selected' : '') + '" onclick="setValue(\'addrType\',\'home\')">Home or office</button></div>';
  if (s.addrType == 'hospital') {
    html = html + field('hosp', 'Hospital name', 'text', '', '');
    html = html + field('ward', 'Ward / floor (optional)', 'text', '', '');
    html = html + field('room', 'Room number', 'text', '', '');
  } else {
    html = html + field('city', 'City', 'text', '', '');
    html = html + field('street', 'Area, street and building', 'text', '', '');
  }
  html = html + '</div>';
  return html;
}

function paymentStep() {
  var html = '<h3>Your details</h3>';
  if (user) {
    html = html + '<p>Logged in as <b>' + safe(user.name) + '</b> (' + safe(user.email) + ')</p>';
    html = html + '<div class="option' + (s.usePoints ? ' selected' : '') + '" onclick="s.usePoints=!s.usePoints;render()">' + checkbox(s.usePoints) + '<div>Use my points<div class="small muted">' + icon('star') + ' ' + user.points + ' pts = ' + Math.floor(user.points / 100) + ' JOD off</div></div></div>';
    if (user.credit > 0) {
      html = html + '<div class="option' + (s.useCredit ? ' selected' : '') + '" onclick="s.useCredit=!s.useCredit;render()">' + checkbox(s.useCredit) + '<div>Use my togift credit<div class="small muted">' + money(user.credit) + ' available</div></div></div>';
    }
  } else {
    html = html + field('email', 'Email', 'email', 'We send your receipt here.', 'name@example.com');
    html = html + '<p class="small muted">Have points? <a href="login.html?next=checkout.html">Log in to use them</a></p>';
  }
  html = html + '<h3 style="margin-top:20px">Payment</h3>';
  html = html + '<div class="notice">Test payment: this is a demo checkout. No real card is charged. <button class="btn-link" onclick="fillTestCard()">Fill test card</button></div>';
  html = html + field('card', 'Card number', 'text', '', '1234 5678 9012 3456');
  html = html + '<div class="grid-2">' + field('exp', 'Expiry (MM/YY)', 'text', '', '08/28') + field('cvc', 'Security code', 'text', '', '123') + '</div>';
  html = html + field('cname', 'Name on card', 'text', '', '');
  return html;
}

function renderSteps() {
  var html = '';
  for (var i = 0; i < stepNames.length; i++) {
    var cls = 'step';
    var mark = (i + 1) + ' ';
    if (i == stepIndex) {
      cls = 'step active';
    } else if (i < stepIndex) {
      cls = 'step done';
      mark = icon('check') + ' ';
    }
    html = html + '<div class="' + cls + '">' + mark + stepNames[i] + '</div>';
  }
  document.getElementById('steps').innerHTML = html;
}

function renderSummary() {
  var html = '<h3>Order summary</h3>';
  html = html + '<div class="row" style="flex-wrap:nowrap"><div style="width:70px;flex-shrink:0">' + productImage(product, false) + '</div><div><b>' + product.name + '</b><div class="muted small">For ' + recipientName() + ' · ' + findStore(product.sid).name + '</div></div></div>';
  html = html + '<div style="margin-top:12px">';
  if (draft.src == 'wishlist') {
    var label = 'Part of the gift';
    if (draft.mode == 'full') {
      label = 'Full gift (item and delivery)';
    }
    html = html + '<div class="sum-row"><span>' + label + '</span><span>' + money(draft.amount) + '</span></div>';
    html = html + '<p class="small muted">If it is not fully funded by the date, your gift becomes togift credit for ' + draft.toName + '.</p>';
  } else {
    html = html + '<div class="sum-row"><span>Item</span><span>' + money(product.price) + '</span></div>';
    html = html + '<div class="sum-row"><span>Delivery</span><span>' + money(product.delivery) + '</span></div>';
    html = html + '<div class="sum-row"><span>Wrapping: ' + wrappingOptions[s.wrap].name + '</span><span>' + money(wrappingOptions[s.wrap].price) + '</span></div>';
  }
  if (pointsDiscount() > 0) {
    html = html + '<div class="sum-row" style="color:#1E6B33"><span>Points discount</span><span>-' + money(pointsDiscount()) + '</span></div>';
  }
  if (creditDiscount() > 0) {
    html = html + '<div class="sum-row" style="color:#1E6B33"><span>togift credit</span><span>-' + money(creditDiscount()) + '</span></div>';
  }
  html = html + '<div class="sum-row total"><span>Total</span><span>' + money(totalAmount()) + '</span></div>';
  html = html + '</div>';
  if (user) {
    html = html + '<p class="small" style="color:#8a6212">' + icon('star') + ' You will earn ' + Math.floor(totalAmount()) + ' points</p>';
  }
  document.getElementById('summaryBox').innerHTML = html;
}

function render() {
  renderSteps();
  var name = stepNames[stepIndex];
  var html = '';
  if (name == 'Message' || name == 'Gift details') {
    html = messageStep();
  } else if (name == 'Delivery') {
    html = deliveryStep();
  } else {
    html = paymentStep();
  }
  html = html + '<div class="row between" style="margin-top:20px">';
  if (stepIndex > 0) {
    html = html + '<button class="btn btn-outline" onclick="prevStep()">Back</button>';
  } else {
    html = html + '<span></span>';
  }
  if (name == 'Payment') {
    html = html + '<button class="btn" onclick="nextStep()">Pay ' + money(totalAmount()) + '</button>';
  } else {
    html = html + '<button class="btn" onclick="nextStep()">Continue</button>';
  }
  html = html + '</div>';
  document.getElementById('formBox').innerHTML = html;
  renderSummary();
}

function addressText() {
  if (draft.src == 'wishlist' || s.recip == 'user') {
    return 'Saved address (hidden)';
  }
  if (s.addrType == 'hospital') {
    return s.hosp + ', room ' + s.room;
  }
  return s.city + ', ' + s.street;
}

function placeOrder() {
  var total = totalAmount();
  var earned = 0;
  var buyerEmail = s.email.trim();
  if (user) {
    buyerEmail = user.email;
    earned = Math.floor(total);
    user.points = user.points - pointsDiscount() * 100 + earned;
    user.credit = user.credit - creditDiscount();
    saveCurrentUser(user);
  }
  var type = 'Full gift';
  var funding = null;
  if (draft.src == 'wishlist') {
    addContribution(draft.username, draft.index, draft.amount, s.anon);
    var after = getItemFunding(draft.username, draft.index);
    if (draft.mode == 'part' && after.status == 'open') {
      type = 'Group gift';
    }
    if (draft.mode == 'part' && after.status != 'open') {
      type = 'Group gift (completed)';
    }
    var wisher = findPerson(draft.username);
    var occ = getPersonOccasion(wisher, wisher.items[draft.index].occ);
    var ends = '';
    if (occ) {
      ends = dateText(addDays(occ.days));
    }
    funding = { funded: after.funded, goal: after.goal, ends: ends };
  }
  var order = {
    id: 'TG-' + Math.floor(10000 + Math.random() * 89999),
    placed: new Date().toISOString(),
    pid: product.id,
    productName: product.name,
    toName: recipientName(),
    toUser: draft.src == 'wishlist' ? draft.username : (s.recip == 'user' ? s.recipUser : ''),
    type: type,
    amount: total,
    anon: s.anon,
    reveal: s.reveal,
    message: s.message,
    wrap: draft.src == 'wishlist' ? 'Chosen by recipient' : wrappingOptions[s.wrap].name,
    buyer: buyerEmail,
    guest: !user,
    status: 0,
    address: addressText(),
    funding: funding,
    earned: earned
  };
  var list = getOrders();
  list.unshift(order);
  saveOrders(list);
  addNotification('Your gift for ' + order.toName + ' was placed. Order ' + order.id + '.');
  localStorage.removeItem('togiftDraft');
  window.location.href = 'confirmation.html?id=' + order.id;
}

if (!draft) {
  window.location.href = 'index.html';
} else {
  product = findProduct(draft.pid);
  if (draft.src == 'wishlist') {
    stepNames = ['Message', 'Payment'];
  } else {
    stepNames = ['Gift details', 'Delivery', 'Payment'];
    if (draft.src == 'advisor' && draft.place == 'Home') {
      s.recip = 'outside';
      s.addrType = 'home';
    }
    if (draft.src == 'advisor' && draft.place == 'Hospital') {
      s.recip = 'outside';
      s.addrType = 'hospital';
    }
    if (draft.src == 'advisor' && draft.place == 'Office') {
      s.recip = 'outside';
      s.addrType = 'home';
    }
  }
  if (draft.occasion) {
    s.occasion = draft.occasion;
  }
  render();
}
