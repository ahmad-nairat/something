var user = requireLogin();
var gifts = [];
var openForm = null;

function loadGifts() {
  gifts = getData('togiftReceived_' + user.email, null);
  if (gifts == null) {
    gifts = [
      { id: 1, from: 'Someone special', anon: true, name: 'JBL Quantum 100 M2 Wired Gaming Headset', occ: 'Birthday', date: dateText(addDays(-4)), card: 'Happy birthday! Enjoy the music.', thanks: false, reported: false },
      { id: 2, from: 'Zain Bondouq and 3 others', anon: false, name: 'Black & Decker Air Fryer, 7.2Lit', occ: 'Group gift', date: dateText(addDays(-12)), card: 'Congrats on the new place!', thanks: false, reported: false }
    ];
    saveGifts();
  }
}

function saveGifts() {
  saveData('togiftReceived_' + user.email, gifts);
}

function findGift(id) {
  for (var i = 0; i < gifts.length; i++) {
    if (gifts[i].id == id) {
      return gifts[i];
    }
  }
}

function openThanks(id) {
  openForm = { id: id, type: 'thanks' };
  showGifts();
}

function openReport(id) {
  openForm = { id: id, type: 'report' };
  showGifts();
}

function cancelForm() {
  openForm = null;
  showGifts();
}

function sendThanks(id) {
  var text = document.getElementById('thanksText').value.trim();
  if (text == '') {
    document.getElementById('thanksField').classList.add('bad');
    return;
  }
  var g = findGift(id);
  g.thanks = true;
  saveGifts();
  openForm = null;
  showGifts();
}

function sendReport(id) {
  var g = findGift(id);
  g.reported = true;
  saveGifts();
  openForm = null;
  showGifts();
}

function toggleAnon() {
  user.allowAnon = !user.allowAnon;
  saveCurrentUser(user);
  showSwitch();
}

function showSwitch() {
  var sw = document.getElementById('anonSwitch');
  if (user.allowAnon) {
    sw.classList.add('on');
  } else {
    sw.classList.remove('on');
  }
}

function showGifts() {
  var html = '';
  for (var i = 0; i < gifts.length; i++) {
    var g = gifts[i];
    html = html + '<div class="card" style="margin-bottom:14px">';
    html = html + '<div class="row between"><b>From ' + g.from + '</b>';
    if (g.anon) {
      html = html + '<span class="badge violet">Anonymous</span>';
    }
    html = html + '</div>';
    html = html + '<div>' + g.name + ' · ' + g.occ + ' · Delivered ' + g.date + '</div>';
    html = html + '<p class="muted">"' + g.card + '"</p>';
    if (openForm && openForm.id == g.id && openForm.type == 'thanks') {
      html = html + '<div class="field" id="thanksField"><label>Your thank-you message</label><textarea id="thanksText" rows="3"></textarea>';
      if (g.anon) {
        html = html + '<div class="hint">ToGift delivers your message privately. You won\'t see who sent the gift, and they stay anonymous.</div>';
      }
      html = html + '<div class="error">Write a short message first.</div></div>';
      html = html + '<div class="row"><button class="btn btn-small" onclick="sendThanks(' + g.id + ')">Send thank-you</button><button class="btn btn-small btn-outline" onclick="cancelForm()">Cancel</button></div>';
    } else if (openForm && openForm.id == g.id && openForm.type == 'report') {
      html = html + '<div class="notice red"><b>Report this anonymous gift?</b><br>Our team reviews it privately and can stop this sender from gifting you anonymously. They won\'t know you reported it.</div>';
      html = html + '<div class="row"><button class="btn btn-small" onclick="sendReport(' + g.id + ')">Report gift</button><button class="btn btn-small btn-outline" onclick="cancelForm()">Cancel</button></div>';
    } else {
      if (g.thanks) {
        html = html + '<div class="notice green"><span class="material-symbols-outlined">check</span> Thank-you sent.' + (g.anon ? ' The sender stays anonymous.' : '') + '</div>';
      }
      if (g.reported) {
        html = html + '<div class="notice">Reported. Our team will review it privately.</div>';
      }
      html = html + '<div class="row">';
      if (!g.thanks) {
        html = html + '<button class="btn btn-small" onclick="openThanks(' + g.id + ')">Send a thank-you</button>';
      }
      if (g.anon && !g.reported) {
        html = html + '<button class="btn btn-small btn-outline" onclick="openReport(' + g.id + ')">Report</button>';
      }
      html = html + '</div>';
    }
    html = html + '</div>';
  }
  document.getElementById('received').innerHTML = html;
}

if (user) {
  document.getElementById('credit').textContent = money(user.credit);
  document.getElementById('points').innerHTML = '<span class="material-symbols-outlined">star</span> ' + user.points + ' pts';
  loadGifts();
  showGifts();
  showSwitch();
}
