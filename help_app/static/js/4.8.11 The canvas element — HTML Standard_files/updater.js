function getRemoteString(url, callback) {
  var x = new XMLHttpRequest();
  x.open('GET', url + "?" + new Date());
  x.onreadystatechange = function () {
    if (x.readyState == 4) {
      if (x.status == 200)
        callback(x.responseText);
      else
        throw 'network error ' + x.status + ': "' + x.statusText + '" while loading ' + url;
    }
  };
  x.send(null);
}
function doUpdate() {
  getRemoteString('revision.dat', function (data) {
    if (data != last_known_revision) {
      getRemoteString('revision-message.dat', function (message) {
        last_known_revision = data;
        var status = document.getElementById('updatesStatus');
        status.textContent = 'This specification has been updated. You are reading ' + current_revision + ' but the latest revision is ' + data + ' ("' +
                             message + '") ';
        var a = document.createElement('a');
        a.href = '';
        a.onclick = function () { location.reload(); return false; };
        a.textContent = "Reload";
        status.appendChild(a);
        status.appendChild(document.createTextNode('. '));
        var d = document.createElement('a');
        d.href = 'http://html5.org/tools/web-apps-tracker?from=' + current_revision.substr(1) + '&to=' + data.substr(1);
        d.textContent = "Diffs";
        status.appendChild(d);
        status.appendChild(document.createTextNode('. '));
        var x = document.createElement('a');
        x.href = '';
        x.onclick = function () { status.textContent = ''; status.className = ''; return false; };
        x.textContent = "Close";
        status.appendChild(x);
        status.appendChild(document.createTextNode('. '));
        status.className = 'relevant';
      });
    }
  });
}

var updater;
function configureUpdates(on) {
  var date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = 'updatesEnabled=' + encodeURIComponent(on?'1':'0') + '; expires=' + date.toGMTString();
  if (updater && !on)
    clearInterval(updater);
  if (!updater && on)
    updater = setInterval(doUpdate, 30000);
  if (on)
    doUpdate();
}

function initUpdater() {
  var configUI = document.getElementById('configUI');

  var updatesUI = document.createElement('p');
  updatesUI.id = 'updatesUI';
  var label = document.createElement('label');
  var input = document.createElement('input');
  input.type = 'checkbox';
  input.id = 'updatesEnabled';
  input.onchange = function () { configureUpdates(input.checked) };
  label.appendChild(input);
  label.appendChild(document.createTextNode(' Watch for updates'));
  updatesUI.appendChild(label);
  configUI.appendChild(updatesUI);

  var updatesStatus = document.createElement('p');
  updatesStatus.id = 'updatesStatus';
  configUI.parentNode.insertBefore(updatesStatus, configUI.nextSibling);

  if (getCookie('updatesEnabled') == '1') {
    document.getElementById('updatesEnabled').checked = true;
    configureUpdates(true);
  }
}

var updaterTimer = new Date();
initUpdater();
if (getCookie('profile') == '1')
  document.getElementsByTagName('h2')[0].textContent += '; updater.js: ' + (new Date() - updaterTimer) + 'ms';
