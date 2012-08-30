var annotationsTimer = new Date();
var annotationsLoops = 0;
var annotationsFinalTimer;

// ========================================================================
// == USER INTERFACE API
// ========================================================================

var activePanel;
function Panel(div, canClose, closeHandler) {
  this.div = div;
  this.canClose = canClose;
  this.closeHandler = function () { if (closeHandler) closeHandler() };
}

// returns false if there was already a panel and that panel couldn't
// be closed (e.g. the user didn't want to close it)
function setActivePanel(panel) {
  if (panel != activePanel) {
    if (!closeActivePanel(true))
      return false;
    if (panel)
      document.body.appendChild(panel.div);
    activePanel = panel;
  }
  return true;
}

// removes the panel
// asks for confirmation if argument is true
// returns false if there is still a panel after the call
function closeActivePanel(confirm) {
  if (activePanel) {
    if (confirm && !activePanel.canClose())
      return false;
    activePanel.div.parentNode.removeChild(activePanel.div);
    activePanel.closeHandler();
    activePanel = null;
  }
  return true;
}

window.addEventListener('keypress', function (event) {
  if (event.keyCode == event.DOM_VK_ESCAPE) {
    if (activePanel)
      closeActivePanel(true);
  }
}, false);

function showListAsPanel(className, title, list, closable) {
  var div = document.createElement('div');
  div.className = "panel " + className;
  var h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode(title));
  div.appendChild(h2);
  var ul = document.createElement('ul');
  for (var i in list) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = list[i];
    a.appendChild(document.createTextNode(list[i]));
    li.appendChild(a);
    ul.appendChild(li)
  }
  div.appendChild(ul);
  if (closable) {
    var p = document.createElement('p');
    var button = document.createElement('button');
    button.appendChild(document.createTextNode('Close'));
    button.onclick = function () {
      closeActivePanel(false);
    };
    p.appendChild(button);
    div.appendChild(p);
  }
  setActivePanel(new Panel(div, function() { return true; }, null));
}


// ========================================================================
// == USER
// ========================================================================

function User(id) {
  this.name = id;
  this.id = id;
  this.showUser = function (closable) {
    alert('Not yet implemented.'); // XXX
  };
}


// ========================================================================
// == STATUS
// ========================================================================

var specStatuses = {
  UNKNOWN: "Section",
  TBW: "Idea; yet to be specified",
  WIP: "Being edited right now",
  OCBE: "Overcome by events",
  FD: "Experimental draft",
  WD: "Work in progress",
  CWD: "Warning! Likely to change!",
  LC: "Ready for first implementations",
  ATRISK: "Being considered for removal",
  CR: "Awaiting implementation feedback",
  REC: "Implemented and widely deployed",
  SPLITFD: "Marked for extraction - Experimental draft",
  SPLIT: "Marked for extraction - Awaiting implementation feedback",
  SPLITREC: "Marked for extraction - Implemented and widely deployed",
};

var implementationNames = {
  IE: "Latest Internet Explorer beta",
  Firefox: "Latest Firefox trunk nightly build",
  Safari: "Latest WebKit or Chromium trunk build",
  Opera: "Latest Opera beta or preview build",
  Shims: "JavaScript libraries, plugins, etc"
};

var implementationStatuses = {
  NONE: "unknown",
  NA: "not applicable",
  PARTIAL: "incomplete support",
  BUG: "complete but buggy support",
  PASS: "excellent support",
  CRASH: "has some support but crashes"
};

var implementationStatusTooltips = {
  PASS: "passes all the available test cases for this feature",
  PARTIAL: "has partial support for this feature, but might have bugs and certainly doesn't support all aspects of this feature",
  NONE: "does not support this feature",
  BUG: "has nearly complete support for this feature, but does not yet pass all the relevant test cases",
  CRASH: "crashes on at least one of the test cases for this feature"
};

function sectionToElement(section) {
  return document.getElementById(section);
}

function elementToSection(element) {
  return element.id;
}

window.activeStatusesBySection = {};

window.activeStatusesByPosition = [];

function updateActiveStatusesByPosition() {
  window.activeStatusesByPosition = [];
  for (var i in window.activeStatusesBySection) {
    var status = window.activeStatusesBySection[i];
    var top = status.panel.offsetTop;
    if (top)
      window.activeStatusesByPosition.push(status);
    status.offsetTop = top;
  }
  window.activeStatusesByPosition.sort(function(a, b) {
    if (a.offsetTop < b.offsetTop)
      return -1;
    if (a.offsetTop > b.offsetTop)
      return 1;
    return 0;
  });
}

function findStatusByPosition(pos, offset) {
  var low = 0;
  var high = window.activeStatusesByPosition.length-1;
  if (high < 1)
    return null;
  while (high-low > 0) {
    var midpoint = (low + ((high-low)/2.0)) * 1.0;
    midpoint = Math.round(midpoint);
    if (pos < window.activeStatusesByPosition[midpoint].offsetTop) {
      high = 1.0 * midpoint-1;
    } else {
      low = 1.0 * midpoint;
    }
  }
  if (pos < window.activeStatusesByPosition[low].offsetTop)
    low = -1;
  low += offset;
  if (low < 0)
    return null;
  if (low >= window.activeStatusesByPosition.length)
    return window.activeStatusesByPosition[window.activeStatusesByPosition.length-1];
  return window.activeStatusesByPosition[low];
}

var currentStatus = null;
var currentOverlayPanel = document.createElement('div');
currentOverlayPanel.className = "status current";
currentOverlayPanel.setAttribute('hidden', '');

var overlayPanelMargin = 20; /* 20px is in the css file too */
function replaceOverlay() {
  var newStatus = findStatusByPosition(window.pageYOffset + overlayPanelMargin, 0);
  if (newStatus) {
    if (newStatus != currentStatus) {
      var newPanel = getPanelDiv(newStatus);
      currentOverlayPanel.className = newPanel.className + " current";
      currentOverlayPanel.onclick = newPanel.onclick;
      while (currentOverlayPanel.hasChildNodes())
        currentOverlayPanel.removeChild(currentOverlayPanel.firstChild);
      while (newPanel.hasChildNodes())
        currentOverlayPanel.appendChild(newPanel.firstChild);
    }
    var nextStatus = findStatusByPosition(window.pageYOffset + overlayPanelMargin + currentOverlayPanel.offsetHeight + overlayPanelMargin * 2, 0);
    if (nextStatus == newStatus &&
        newStatus.offsetTop + newStatus.panel.offsetHeight < window.pageYOffset + overlayPanelMargin * 3/4)
      currentOverlayPanel.removeAttribute('hidden');
  } else {
    currentOverlayPanel.setAttribute('hidden', '');
  }
  currentStatus = newStatus;
}

var currentReplacer = 0;
var pendingStatusesDirty = false;
function getReplacer(statusesDirty) {
  return function() {
    if (currentReplacer)
      clearTimeout(currentReplacer);
    else
    if (currentOverlayPanel)
      currentOverlayPanel.setAttribute('hidden', '');
    pendingStatusesDirty = pendingStatusesDirty || statusesDirty;
    currentReplacer = setTimeout(function() {
      currentReplacer = 0;
      if (pendingStatusesDirty)
        updateActiveStatusesByPosition();
      pendingStatusesDirty = false;
      replaceOverlay();
      if (annotationsTimer) {
        if (getCookie('profile') == '1')
          document.getElementsByTagName('h2')[0].textContent += '; status.js: ' + (new Date() - annotationsTimer) + 'ms in ' + annotationsLoops + ' loops and final step of ' + (new Date() - annotationsFinalTimer) + 'ms';
        annotationsTimer = 0;
      }
    }, 2000);
  };
}

function getPanelDiv(that) {
  var div = document.createElement('div');
  div.className = "status " + that.status;

  var p0 = document.createElement('p');
  var strong0 = document.createElement('strong');
  strong0.appendChild(document.createTextNode(specStatuses[that.status]));
  p0.appendChild(strong0);
  div.appendChild(p0);

  var pid = document.createElement('p');
  pid.className = 'idref';
  var pida = document.createElement('a');
  pida.appendChild(document.createTextNode('#' + that.section));
  pida.href = "#" + that.section;
  pid.appendChild(pida);
  div.appendChild(pid);

  if (that.tests.length > 0) {
    var p1 = document.createElement('p');
    p1.appendChild(document.createTextNode('Tests: ' + that.tests.length + (that.tests.length > 0 ? ' \u2014 ' : '')));
    var a1 = document.createElement('a');
    a1.appendChild(document.createTextNode('View...'));
    a1.href = "http://www.whatwg.org/specs/web-apps/current-work/show-tests.html?section=" + encodeURIComponent(that.section);
    a1.onclick = function () { that.showTests(true); return false; };
    p1.appendChild(a1);
    div.appendChild(p1);
  }

  if (that.demos.length > 0) {
    var p2 = document.createElement('p');
    p2.appendChild(document.createTextNode('Demos: ' + that.demos.length + (that.demos.length > 0 ? ' \u2014 ' : '')));
    var a2 = document.createElement('a');
    a2.appendChild(document.createTextNode('View...'));
    a2.href = "http://www.whatwg.org/specs/web-apps/current-work/show-demos.html?section=" + encodeURIComponent(that.section);
    a2.onclick = function () { that.showDemos(true); return false; };
    p2.appendChild(a2);
    div.appendChild(p2);
  }

  var p3 = document.createElement('div');
  p3.className = "implementations";
  for (var code in implementationNames) {
    if (!(that.implementations[code] in implementationStatuses)) {
      that.implementations[code] = 'NONE';
    }
    var impl = document.createElement('p');
    impl.className = code + " " + that.implementations[code];
    var fullName = implementationNames[code];
    var fullStatus = implementationStatuses[that.implementations[code]];
    impl.appendChild(document.createTextNode(fullName + ": " + fullStatus));
    if (that.implementations[code] in implementationStatusTooltips) {
      impl.title = fullName + ': ' + implementationStatusTooltips[that.implementations[code]];
    }
    p3.appendChild(impl);
  }
  div.appendChild(p3);

  var p4 = document.createElement('p');
  p4.className = 'last-edit';
  var a4i = document.createElement('a');
  a4i.appendChild(document.createTextNode(that.lastEditTime.getUTCFullYear() + '-' +
                                          String("0" + (that.lastEditTime.getUTCMonth()+1)).slice(-2) + '-' +
                                          String("0" + that.lastEditTime.getUTCDate()).slice(-2)));
  //a4i.href = "http://www.whatwg.org/specs/web-apps/current-work/show-history.html?section=" + encodeURIComponent(that.section);
  //a4i.onclick = function () { that.showHistory(true); return false; };
  p4.appendChild(a4i);
  p4.appendChild(document.createTextNode(' '));
  var a4ii = document.createElement('a');
  a4ii.appendChild(document.createTextNode(that.lastEditUser.name));
  //a4ii.href = "http://www.whatwg.org/specs/web-apps/current-work/show-user.html?user=" + encodeURIComponent(that.lastEditUser.id);
  //a4ii.onclick = function () { that.lastEditUser.showUser(true); return false; };
  p4.appendChild(a4ii);
  div.appendChild(p4);

  var p5 = document.createElement('p');
  p5.className = 'edit-link';
  var a5 = document.createElement('a');
  a5.appendChild(document.createTextNode('Edit this information...'));
  a5.href = "http://www.whatwg.org/specs/web-apps/current-work/edit-section.html?section=" + encodeURIComponent(that.section);
  a5.onclick = function (event) { that.edit(true, null); return false; };
  p5.appendChild(a5);
  div.appendChild(p5);
  div.onclick = function (event) {
    if (event.detail == 2 && event.button == 0 && event.altKey)
      that.edit(true, null);
  }
  return div;
}

function Status(section, /* spec range string */
                status, /* one of: UNKNOWN, TBW, WIP, FD, CWD, WD, LC, CR, REC */
                tests, /* array of URIs */
                demos, /* array of URIs */
                implementations, /* dictionary of browser => state,
                                    where browser is one of Safari, IE, Firefox, Opera, Shims
                                    and state is one of PASS, PARTIAL, NONE, BUG, CRASH */
                lastEditTime, /* Date */
                lastEditUser, /* User object */
                network /* SpecStatusNetworkConnection object */
               ) {
  var that = this;

  // data
  this.section = section;
  this.status = status;
  this.tests = tests;
  this.tests.sort();
  this.demos = demos;
  this.demos.sort();
  this.implementations = implementations;
  this.lastEditTime = lastEditTime;
  this.lastEditUser = lastEditUser;
  this.network = network;
  this.pendingUpdates = false;
  this.newSection = null;

  // public methods
  this.show = function (quick) {
    this.panel = getPanelDiv(this);
    var target = sectionToElement(section);
    if (!target)
      return; // not on this page
    target.parentNode.insertBefore(this.panel, target.nextSibling);
    window.activeStatusesBySection[this.section] = this;
    if (!quick)
      getReplacer(true)();
  };
  this.hide = function () {
    this.panel.parentNode.removeChild(this.panel);
    delete window.activeStatusesBySection[this.section];
    getReplacer(true)();
  };

  // private methods
  this.showTests = function (closable) {
    showListAsPanel('tests', 'Tests', this.tests, closable);
  };
  this.showDemos = function (closable) {
    showListAsPanel('demos', 'Demos', this.demos, closable);
  };
  this.showHistory = function (closable) {
    alert('Not yet implemented.'); // XXX
  };

  this.edit = function (closable, callback) {
    showLoginForm(network, closable, function() {
      that.showEdit(closable, callback);
    });
  };
  this.editing = false;
  this.showEdit = function (closable, callback) {
    if (this.editing)
      return; // non-reentrant
    var div = document.createElement('div');
    div.className = "panel editor";
    var h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode("Edit '#" + that.section + "'"));
    div.appendChild(h2);
    var form = document.createElement('form');
    form.addEventListener('change', function () {
      form.className = 'changed';
    }, true);
    form.addEventListener('input', function () {
      form.className = 'changed';
    }, true);
    // XXX should have a way to change the 'section' bit too
    var pStatus = document.createElement('p');
    var labelStatus = document.createElement('label');
    labelStatus.appendChild(document.createTextNode('Section status: '));
    var selectStatus = document.createElement('select');
    selectStatus.name = "specStatus";
    for (var code in specStatuses) {
      if (code != 'UNKNOWN' || this.status == 'UNKNOWN') {
        var option = document.createElement('option');
        option.value = code;
        option.appendChild(document.createTextNode(specStatuses[code]));
        if (code == this.status)
          option.selected = true;
        selectStatus.appendChild(option);
      }
    }
    labelStatus.appendChild(selectStatus);
    pStatus.appendChild(labelStatus);
    form.appendChild(pStatus);
    var pTests = document.createElement('p');
    var labelTests = document.createElement('label');
    labelTests.appendChild(document.createTextNode('Links to tests for this section: '));
    var textareaTests = document.createElement('textarea');
    textareaTests.name = "tests";
    for (var i in this.tests)
      textareaTests.appendChild(document.createTextNode(this.tests[i] + "\r\n"));
    labelTests.appendChild(textareaTests);
    pTests.appendChild(labelTests);
    form.appendChild(pTests);
    var pDemos = document.createElement('p');
    var labelDemos = document.createElement('label');
    labelDemos.appendChild(document.createTextNode('Links to demos for this section: '));
    var textareaDemos = document.createElement('textarea');
    textareaTests.name = "demos";
    for (var i in this.demos)
      textareaDemos.appendChild(document.createTextNode(this.demos[i] + "\r\n"));
    labelDemos.appendChild(textareaDemos);
    pDemos.appendChild(labelDemos);
    form.appendChild(pDemos);
    var pImplStatus = document.createElement('p');
    pImplStatus.appendChild(document.createTextNode('Implementation Status:'));
    form.appendChild(pImplStatus);
    var dlImplStatus = document.createElement('dl');
    for (var implCode in implementationNames) {
      var dtImplStatus = document.createElement('dt');
      var labelImplStatus = document.createElement('label');
      labelImplStatus.htmlFor = 'panel-impl-status-control-' + implCode;
      labelImplStatus.appendChild(document.createTextNode(implementationNames[implCode] + ': '));
      var ddImplStatus = document.createElement('dd');
      var selectImplStatus = document.createElement('select');
      selectImplStatus.name = implCode;
      selectImplStatus.id = labelImplStatus.htmlFor;
      for (var code in implementationStatuses) {
        var option = document.createElement('option');
        option.value = code;
        option.appendChild(document.createTextNode(implementationStatuses[code]));
        option.title = implementationStatusTooltips[code];
        if (code == this.implementations[implCode])
          option.selected = true;
        if (code in implementationStatusTooltips) {
          var s = implementationStatusTooltips[code];
          option.title = s.replace(/%s/g, implementationNames[implCode]);
        }
        selectImplStatus.appendChild(option);
      }
      dtImplStatus.appendChild(labelImplStatus);
      ddImplStatus.appendChild(selectImplStatus);
      dlImplStatus.appendChild(dtImplStatus);
      dlImplStatus.appendChild(ddImplStatus);
    }
    form.appendChild(dlImplStatus);
    div.appendChild(form);

    function save(callback) {
      var data = {};
      // XXX also update data.section if it changed
      var newSection = that.section;
      if (selectStatus.value != that.status)
        data.status = selectStatus.value;
      function doList (textarea, dataField, original) {
        var values = textarea.value.split(/[\r\n]/);
        values.sort();
        var deleted = [];
        var inserted = [];
        var valuesIndex = 0;
        var originalIndex = 0;
        while (valuesIndex < values.length || originalIndex < original.length) {
          // (code duplication here is to avoid extraneous expressions in the conditions)
          // (i'm sure this could be optimised further...)
          if (values[valuesIndex] == '') {
            // ignore blank lines
            valuesIndex += 1;
          } else if (valuesIndex >= values.length) {
            // original was deleted
            deleted.push(original[originalIndex]);
            originalIndex += 1;
          } else if (originalIndex >= original.length) {
            // value was inserted
            inserted.push(values[valuesIndex]);
            valuesIndex += 1;
          } else if (values[valuesIndex] > original[originalIndex]) {
            // original was deleted
            deleted.push(original[originalIndex]);
            originalIndex += 1;
          } else if (values[valuesIndex] < original[originalIndex]) {
            // value was inserted
            inserted.push(values[valuesIndex]);
            valuesIndex += 1;
          } else {
            // synchronised, advance
            originalIndex += 1;
            valuesIndex += 1;
          }
        }
        if (inserted.length)
          data[dataField + "Inserted"] = inserted;
        if (deleted.length)
          data[dataField + "Deleted"] = deleted;
      };
      doList(textareaTests, 'tests', that.tests);
      doList(textareaDemos, 'demos', that.demos);
      data.implementations = {};
      for (var implCode in implementationNames) {
        var select = form.elements[implCode];
        if (select.value != that.implementations[implCode])
          data.implementations[implCode] = select.value;
      }
      that.network.updateEntry(section, data, function (success, message) {
        if (success) {
          form.className = ''; 
          that.newSection = newSection;
          that.pendingUpdates = true;
        } else {
          alert('Failed to save data: ' + message);
        }
        if (callback)
          callback(success);
      });
    }

    var buttonP = document.createElement('p');
    var buttonSave = document.createElement('button');
    buttonSave.appendChild(document.createTextNode('Save'));
    buttonSave.onclick = function () {
      save(null);
    };
    buttonP.appendChild(buttonSave);

    function confirmClose() {
      if (!closable)
        return false;
      if (form.className == '')
        return true;
      return confirm(that.pendingUpdates ? "Are you sure you want to discard the changes you made since you last saved?"
                                         : "Are you sure you want to discard your changes?");
    }

    if (closable) {
      buttonP.appendChild(document.createTextNode(' '));
      var buttonSaveAndClose = document.createElement('button');
      buttonSaveAndClose.appendChild(document.createTextNode('Save and close'));
      buttonSaveAndClose.onclick = function () {
        save(function (success) {
          if (success)
            closeActivePanel(false);
        });
      };
      buttonP.appendChild(buttonSaveAndClose);
      buttonP.appendChild(document.createTextNode(' '));
      var buttonCancel = document.createElement('button');
      buttonCancel.appendChild(document.createTextNode('Cancel'));
      buttonCancel.onclick = function () { closeActivePanel(true); };
      buttonP.appendChild(buttonCancel);
    }
    div.appendChild(buttonP);

    function closed() {
      that.editing = false;
      if (that.pendingUpdates) {
        that.hide();
        that.network.getAnnotation(that.newSection, function (status) {
          status.show(false);
        });
        if (callback)
          callback(true);
      } else {
        if (callback)
          callback(false);
      }
    }

    this.editing = true;
    setActivePanel(new Panel(div, confirmClose, closed));
  };

}



// ========================================================================
// == NETWORK
// ========================================================================

function SpecStatusNetworkConnection() {
  var that = this;

  function getCookie(name) {
    var cookies = document.cookie.split("; ");
    for (var index = 0; index < cookies.length; index++) {
      var data = cookies[index].split("=");
      if (data[0] == name)
        return decodeURIComponent(data[1]);
    }
    return null;
  }

  function setCookie(name, value) {
    var date = new Date();
    date.setYear(date.getYear()+1902);
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + date.toGMTString();
  }

  this.username = getCookie('status-username');
  this.password = getCookie('status-password');

  function doXMLHttpRequest(method, url, data, setup, success, failure) {
    var x = new XMLHttpRequest();
    x.open(method, url, true);
    x.onreadystatechange = function (event) {
      if (x.readyState == 4) {
        if (x.status == 204) {
          success(null);
        } else if ((x.status != 200) && (x.status != 304)) {
          failure("Error: " + x.statusText + " (" + x.status + ")");
        } else if (x.getResponseHeader("Content-Type") == 'text/xml') {
          if (x.responseXML) {
            success(x.responseXML);
          } else {
            failure('server-side XML error');
          }
        } else if (x.getResponseHeader("Content-Type").match(/^text\/plain( *;.*)?$/)) {
          success(x.responseText);
        } else {
          failure("Error: Server used type " + x.getResponseHeader("Content-Type"));
        }
      }
    };
    if (setup) setup(x);
    x.send(data);
  }

  function sendPost(url, datatype, data, success, failure) {
    doXMLHttpRequest("POST", url, data, function (x) {
      x.setRequestHeader("Content-Type", datatype);
    }, success, failure);
  }

  function sendGet(url, success, failure) {
    doXMLHttpRequest("GET", url, null, null, success, failure);
  }

  function fatalNetworkError(message) {
    //alert("Fatal network error: " + message);
  }

  function getValuesFromChildNodes(node, name) {
    var result = [];
    for (var index = 0; index < node.childNodes.length; index += 1) {
      var child = node.childNodes[index];
      if (child.nodeType == 1 && child.tagName == name)
        result.push(child.textContent);
    }
    return result;
  }

  this.processEntry = function (node, callback) {
    var tests = getValuesFromChildNodes(node, "test");
    var demos = getValuesFromChildNodes(node, "demo");
    var implementations = {};
    for (var index = 0; index < node.childNodes.length; index += 1) {
      var child = node.childNodes[index];
      if (child.nodeType == 1 && child.tagName == "implementation")
        implementations[child.getAttribute("name")] = child.getAttribute("state");
    }
    var status = new Status(node.getAttribute("section"),
                            node.getAttribute("status"),
                            tests, demos, implementations,
                            new Date(node.getAttribute("lastEditTime")*1000),
                            new User(node.getAttribute("lastEditUser")),
                            this);
    callback(status);
  };

  this.getAnnotations = function (callback, lastcallback) {
    sendGet('http://www.whatwg.org/specs/web-apps/current-work/status.cgi?action=get-all-annotations',
      function (response) {
        // success
        if (response.documentElement.tagName != "annotations")
          return fatalNetworkError('unexpected response from server');
        for (var entryIndex = 0; entryIndex < response.documentElement.childNodes.length; entryIndex += 1) {
          var node = response.documentElement.childNodes[entryIndex];
          if (node.nodeType == 1 && node.tagName == "entry")
            that.processEntry(node, callback);
        }
        setTimeout(lastcallback, 100);
      }, fatalNetworkError);
  };
  this.getAnnotation = function (section, callback) {
    sendGet('http://www.whatwg.org/specs/web-apps/current-work/status.cgi?action=get-one-annotation&section=' + encodeURIComponent(section),
      function (response) {
        // success
        var node = response.documentElement;
        if (node.tagName == "entry")
          that.processEntry(node, callback);
        else
          fatalNetworkError('unexpected response from server');
      }, fatalNetworkError);
  };
  this.createAccount = function (username, email, callback) {
    sendPost("http://www.whatwg.org/specs/web-apps/current-work/status.cgi",
             "application/x-www-form-urlencoded",
             "action=create-account" + "&" +
             "username=" + encodeURIComponent(username) + "&" +
             "email=" + encodeURIComponent(email),
             function () {
               callback(true);
             }, function (message) {
               callback(false, message);
             });
  };
  this.login = function (username, password, callback) {
    sendPost("http://www.whatwg.org/specs/web-apps/current-work/status.cgi",
             "application/x-www-form-urlencoded",
             "action=login" + "&" +
             "username=" + encodeURIComponent(username) + "&" +
             "password=" + encodeURIComponent(password),
             function () {
               this.username = username;
               setCookie('status-username', username);
               this.password = password;
               setCookie('status-password', password);
               callback(true);
             }, function (message) {
               callback(false, message);
             });
  };
  this.updateEntry = function (section, data, callback) {
    var patch = '';
    if ("section" in data) {
      patch += "&oldSection=" + encodeURIComponent(section);
      patch += "&section=" + encodeURIComponent(data.section);
    } else {
      patch += "&section=" + encodeURIComponent(section);
    }
    if ("status" in data) {
      patch += "&status=" + encodeURIComponent(data.status);
    }
    function doList(list, field) {
      if (list in data)
        for (var index = 0; index < data[list].length; index += 1)
          patch += "&" + encodeURIComponent(field) + "=" + encodeURIComponent(data[list][index]);
    }
    doList("testsInserted", "testInserted");
    doList("testsDeleted", "testDeleted");
    doList("demosInserted", "demoInserted");
    doList("demosDeleted", "demoDeleted");
    if ("implementations" in data)
      for (var implCode in data.implementations)
        patch += "&implementation=" + encodeURIComponent(implCode) + ":" +
                                      encodeURIComponent(data.implementations[implCode]);
    sendPost("http://www.whatwg.org/specs/web-apps/current-work/status.cgi",
             "application/x-www-form-urlencoded",
             "action=update" + "&" +
             "username=" + encodeURIComponent(this.username) + "&" +
             "password=" + encodeURIComponent(this.password) +
             patch,
             function () { callback(true); },
             function (message) { callback(false, message); });
  };
  this.getHistory = function (section, callback) {
    // XXX
    callback(false);
  };
  this.getUser = function (userid, callback) {
    // XXX
    callback(new User(userid));
  };


  // Subscriptions API
  this.subscribe = function (topic, callback, failed) {
    sendPost("http://www.whatwg.org/specs/web-apps/current-work/status.cgi",
             "application/x-www-form-urlencoded",
             "action=subscribe" + "&" +
             "username=" + encodeURIComponent(this.username) + "&" +
             "password=" + encodeURIComponent(this.password) + "&" +
             "topic=" + encodeURIComponent(topic),
             function (data) { callback(data.split(/[\r\n]+/)); },
             function (message) { failed(message); });
  };
  this.unsubscribe = function (topic, callback, failed) {
    sendPost("http://www.whatwg.org/specs/web-apps/current-work/status.cgi",
             "application/x-www-form-urlencoded",
             "action=unsubscribe" + "&" +
             "username=" + encodeURIComponent(this.username) + "&" +
             "password=" + encodeURIComponent(this.password) + "&" +
             "topic=" + encodeURIComponent(topic),
             function (data) { callback(data.split(/[\r\n]+/)); },
             function (message) { failed(message); });
  };
  this.getSubscriptions = function (callback, failed) {
    sendGet("http://www.whatwg.org/specs/web-apps/current-work/status.cgi?" +
            "action=get-subscriptions" + "&" +
            "username=" + encodeURIComponent(this.username) + "&" +
            "password=" + encodeURIComponent(this.password),
            function (data) { callback(data.split(/[\r\n]+/)); },
            function (message) { failed(message); });
  };
}


// ========================================================================
// == LOGIN
// ========================================================================

var loginStatusSpan = document.createElement('span'); // must be at the end of an element
loginStatusSpan.title = "";
function tryLogin(network, callback) {
  loginStatusSpan.textContent = 'Logging in as ' + network.username + '...';
  network.login(network.username, network.password, function(success, message) {
    if (success) {
      loginStatusSpan.textContent = 'Logged in as ' + network.username + '.';
    } else {
      loginStatusSpan.textContent = message + '.';
    }
    if (callback)
      callback(success, message);
  });
}

// callback is called upon successful login
// if closable is false, then callback will be called (or page closed)
function showLoginPanel(network, closable, callback) {
  var oldLoginStatusSpanParent = loginStatusSpan.parentNode;
  var div = document.createElement('div');
  div.className = "panel login";
  var h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode("Login"));
  div.appendChild(h2);
  var form = document.createElement('form');
  var p1 = document.createElement('p');
  var label1 = document.createElement('label');
  label1.appendChild(document.createTextNode('Username: '));
  var usernameField = document.createElement('input');
  usernameField.type = "text";
  usernameField.value = network.username || "";
  label1.appendChild(usernameField);
  p1.appendChild(label1);
  form.appendChild(p1);
  var p2 = document.createElement('p');
  var label2 = document.createElement('label');
  label2.appendChild(document.createTextNode('Password: '));
  var passwordField = document.createElement('input');
  passwordField.type = "password";
  passwordField.value = network.password || "";
  label2.appendChild(passwordField);
  p2.appendChild(label2);
  form.appendChild(p2);
  var p3 = document.createElement('p');
  p3.appendChild(document.createTextNode('Status: '));
  p3.appendChild(loginStatusSpan);
  form.appendChild(p3);
  div.appendChild(form);
  var p4 = document.createElement('p');
  var button1 = document.createElement('button');
  button1.appendChild(document.createTextNode('Login'));
  button1.onclick = function () {
    if (usernameField.value && passwordField.value) {
      network.username = usernameField.value;
      network.password = passwordField.value;
      tryLogin(network, function (success, message) {
        if (success) {
          closeActivePanel(false);
          if (callback)
            callback();
        }
      });
    } else {
      alert("You must enter a username and password.");
    }
  };
  p4.appendChild(button1);
  p4.appendChild(document.createTextNode(" "));
  var button2 = document.createElement('button');
  button2.appendChild(document.createTextNode('Request Account...'));
  button2.onclick = function () {
    closeActivePanel(false);
    showAccountRequestPanel(network, closable, callback);
  };
  p4.appendChild(button2);
  if (closable) {
    p4.appendChild(document.createTextNode(" "));
    var button3 = document.createElement('button');
    button3.appendChild(document.createTextNode('Close'));
    button3.onclick = function () {
      closeActivePanel(false);
    };
    p4.appendChild(button3);
  }
  div.appendChild(p4);
  setActivePanel(new Panel(div, function() { return closable; }, function () {
    oldLoginStatusSpanParent.appendChild(loginStatusSpan);
  }));
  if (usernameField.value.length == 0)
    usernameField.focus();
  else
    passwordField.focus();
}

function showAccountRequestPanel(network, closable, loginCallback) {
  var div = document.createElement('div');
  div.className = "panel accountRequest";
  var h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode("Account Request"));
  div.appendChild(h2);
  var form = document.createElement('form');
  var p1 = document.createElement('p');
  var label1 = document.createElement('label');
  label1.appendChild(document.createTextNode('Username: '));
  var usernameField = document.createElement('input');
  usernameField.type = "text";
  usernameField.value = network.username || "";
  label1.appendChild(usernameField);
  p1.appendChild(label1);
  form.appendChild(p1);
  var p2 = document.createElement('p');
  var label2 = document.createElement('label');
  label2.appendChild(document.createTextNode('E-mail: '));
  var emailField = document.createElement('input');
  emailField.type = "email";
  emailField.value = "";
  label2.appendChild(emailField);
  p2.appendChild(label2);
  form.appendChild(p2);
  div.appendChild(form);
  var p4 = document.createElement('p');
  var button1 = document.createElement('button');
  button1.appendChild(document.createTextNode('Request Account and Retry Login...'));
  button1.onclick = function () {
    if (usernameField.value && emailField.value) {
      network.createAccount(usernameField.value, emailField.value, function(success, message) {
        if (success) {
          alert("A password has been e-mailed to the address you provided.");
          network.username = usernameField.value;
          network.password = '';
          showLoginPanel(network, closable, loginCallback);
        } else {
          alert("Either you typed in an incorrect e-mail address, or the username is already taken. If the account is yours, your password may have been e-mailed to you again.");
        }
      });
    } else {
      alert("You must enter a username and e-mail address.");
    }
  };
  p4.appendChild(button1);
  p4.appendChild(document.createTextNode(" "));
  var button2 = document.createElement('button');
  button2.appendChild(document.createTextNode('Retry Login...'));
  button2.onclick = function () {
    closeActivePanel(false);
    showLoginPanel(network, closable, loginCallback);
  };
  p4.appendChild(button2);
  if (closable) {
    p4.appendChild(document.createTextNode(" "));
    var button3 = document.createElement('button');
    button3.appendChild(document.createTextNode('Close'));
    button3.onclick = function () {
      closeActivePanel(false);
    };
    p4.appendChild(button3);
  }
  div.appendChild(p4);
  setActivePanel(new Panel(div, function() { return closable; }, null));
  usernameField.focus();
}


// ========================================================================
// == SUBSCRIPTIONS
// ========================================================================

var topicList = ['Canvas','DOM APIs','HTML','HTML Syntax and Parsing','Microdata','Offline Web Applications','Rendering','Security','Server-Sent Events','Video Text Tracks','Video and Audio','Web Storage','Web Workers','WebSocket API',];

function showSubPanel(network) {
  var div = document.createElement('div');
  div.className = "panel";
  var h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode("Edit Subscriptions"));
  div.appendChild(h2);
  var form = document.createElement('form');
  var pIntro = document.createElement('p');
  pIntro.textContent = 'Please select the topics for which you wish to receive explicit e-mail notifications. ';
  var pIntroWarning = document.createElement('strong');
  pIntroWarning.textContent = 'This will result in a LOT of e-mail. The spec is often edited several times a day, and you will receive an e-mail for each such edit.';
  pIntro.appendChild(pIntroWarning);
  form.appendChild(pIntro);
  var ulTopics = document.createElement('ul');
  ulTopics.className = 'brief checkboxes';
  var checkboxes = {};
  function updateCheckboxes(data) {
    var subscriptions = {};
    for (var line in data)
      if (data[line] != '')
        subscriptions[data[line]] = 1;
    for (var topic in topicList)
      checkboxes[topicList[topic]].checked = subscriptions[topicList[topic]] ? true : false;
  }
  network.getSubscriptions(updateCheckboxes, alert);
  for (var topic in topicList) {
    var li = document.createElement('li');
    var label = document.createElement('label');
    (function (checkbox, value) {
      checkbox.type = 'checkbox';
      checkboxes[value] = checkbox;
      checkbox.onchange = checkbox.oninput = function () {
        if (checkbox.checked)
          network.subscribe(value, updateCheckboxes, alert)
        else
          network.unsubscribe(value, updateCheckboxes, alert);
      };
      label.appendChild(checkbox);
    })(document.createElement('input'), topicList[topic]);
    label.appendChild(document.createTextNode(' ' + topicList[topic]));
    li.appendChild(label);
    ulTopics.appendChild(li);
  }
  form.appendChild(ulTopics);
  var pOutro = document.createElement('p');
  pOutro.textContent = 'If you would like another topic to be on this list as a separate topic, please e-mail Ian Hickson <ian@hixie.ch>.';
  form.appendChild(pOutro);
  div.appendChild(form);
  var buttonP = document.createElement('p');
  var buttonClose = document.createElement('button');
  buttonClose.appendChild(document.createTextNode('Close'));
  buttonClose.onclick = function () { closeActivePanel(false); };
  buttonP.appendChild(buttonClose);
  div.appendChild(buttonP);
  setActivePanel(new Panel(div, function() { return true; }, null));
}


// ========================================================================
// == MAIN
// ========================================================================

function initAnnotations() {
  var network = new SpecStatusNetworkConnection();
  var statusList = [];
  network.getAnnotations(
    function (status) {
      statusList.push(status);
    },
    function () {
      var i = 0;
      var showStatus = function () {
        annotationsLoops += 1;
        var start = new Date();
        while (i < statusList.length) {
          statusList[i].show(true);
          i += 1;
          if (new Date() - start > 3000) {
            setTimeout(showStatus, 10000);
            return;
          }
        }
        annotationsFinalTimer = new Date();
        getReplacer(true)();
        window.addEventListener('resize', getReplacer(true), false);
        window.addEventListener('scroll', getReplacer(false), false);
        var loginP = document.createElement('p');
        loginP.className = 'loginUI';
        var loginA = document.createElement('a');
        loginA.href = 'http://www.whatwg.org/specs/web-apps/current-work/status-documentation.html';
        loginA.appendChild(document.createTextNode('Specification annotation system'));
        loginP.appendChild(loginA);
        loginP.appendChild(document.createTextNode(': '));
        var loginButton = document.createElement('input');
        loginButton.type = 'button';
        loginButton.value = 'Login...';
        loginButton.onclick = function(event) {
          showLoginPanel(network, true, null);
        };
        loginP.appendChild(loginButton);
        loginP.appendChild(document.createTextNode(' '));
        loginP.appendChild(loginStatusSpan);
        if (network.username && network.password)
          tryLogin(network, null);
        var configUI = document.getElementById('configUI');
        configUI.appendChild(loginP);
        document.body.appendChild(currentOverlayPanel);
        document.addEventListener('click', function(event) {
          if (event.detail == 2 && event.button == 0 && event.altKey) {
            var section = event.target;
            while (section && !section.id) {
              if (section.previousSibling)
                section = section.previousSibling;
              else
                section = section.parentNode;
            }
            if (section && section.id && !section.className.match(/\bpanel\b/)) {
              if (section.id in window.activeStatusesBySection) {
                window.activeStatusesBySection[section.id].edit(true, null);
              } else {
                var status = new Status(section.id, 'UNKNOWN', [], [], {}, new Date(), new User('(unsaved)'), network);
                status.show(false);
                status.edit(true, function (saved) {
                  if (!saved)
                    status.hide();
                });
              }
              event.preventDefault();
            }
          }
        }, false);
        document.body.className += " statusEnabled";

        // subscriptions UI
        var subP = document.createElement('p');
        subP.className = 'subUI';
        var subButton = document.createElement('input');
        subButton.type = 'button';
        subButton.value = 'Edit Subscriptions...';
        subButton.onclick = function(event) { showLoginForm(network, function () { return true }, function () { showSubPanel(network) }) };
        subP.appendChild(subButton);
        configUI.appendChild(subP);
      };
      showStatus();
    }    
  );
}

function showLoginForm(network, closable, callback) {
  if (network.username && network.password) {
    tryLogin(network, function(success, message) {
      if (!success)
        showLoginPanel(network, closable, callback);
      else
        callback();
    });
  } else {
    showLoginPanel(network, closable, callback);
  }
}

function requireLogin(network, callback) {
  showLoginForm(network, false, callback);
}

// setup
initAnnotations();
