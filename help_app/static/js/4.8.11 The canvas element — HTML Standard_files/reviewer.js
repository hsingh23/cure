if (!window.showAlert)
  showAlert = alert;

var reviewer;
var reviewSectionId;

function setReviewMode(mode) {
  var date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  document.cookie = 'review=' + encodeURIComponent(mode) + '; expires=' + date.toGMTString() + '; path=/';
  reviewer.className = mode;
  if (mode == 'off')
    document.getElementById('reviewShowHide').value = '\u2B05';
  else
    document.getElementById('reviewShowHide').value = '\u27A1';
}

function showReviewHelp() {
  alert('Select a section by clicking it, then enter a message in the box and press the "Submit Review Comment" button. This will cause your comment to be filed, along with your IP address, in the W3C HTML working group Bugzilla, where it will be reviewed and eventually addressed. You won\'t get a reply, though. If you want to receive a reply, please instead send e-mail to the mailing list mentioned at the top of this specification.');
}

function toggleReviewMode() {
  setReviewMode(reviewer.className == 'off' ? 'on' : 'off');
}

function submitReviewComment(textField, button) {
  var text = document.getElementById('reviewCommentText').value;
  if ((!reviewSectionId) || (reviewSectionId == 'reviewCommentText')) {
    showAlert('Please select a section by clicking on it, and then submit the comment again.');
  } else if (!text) {
    showAlert('Please enter a description of the problem you have found, and then submit the comment again.');
  } else if ((text.length <= 5) || (text.indexOf(' ') == text.lastIndexOf(' '))) {
    showAlert('Please ensure that your comment is descriptive enough that the editor can understand it.');
  } else /*if (confirm("Your feedback will now be submitted in the public HTML5 issue tracking database and may be seen by hundreds of people."))*/ {
    var x = new XMLHttpRequest();
    x.open('POST', 'http://www.whatwg.org/specs/web-apps/current-work/file-bug.cgi');
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    x.onreadystatechange = function () {
      if (x.readyState == 4) {
        if (x.status == 200 && x.responseText != 'ERROR') {
          showAlert('Thank you for helping the HTML5 effort! Your comment was filed as bug ' + x.responseText + '. You can see it at:', 'https://www.w3.org/Bugs/Public/show_bug.cgi?id=' + x.responseText);
        } else {
          showAlert('An error occured while submitting your comment. Please let ian@hixie.ch know.');
        }
        button.disabled = false;
        textField.select();
      }
    };
    var s_username = getCookie('status-username');
    var s_password = getCookie('status-password');
    var s_login = '';
    if (s_username && s_password)
      s_login = '&username=' + encodeURIComponent(s_username) + '&password=' + encodeURIComponent(s_password);
    var opt_component = '';
    var section = document.getElementById(reviewSectionId);
    if (section) {
      var component = '';
      while (section && section.getAttribute && !component) {
        component = section.getAttribute('data-component');
        section = section.parentNode;
      }
      if (component)
        opt_component = '&component=' + encodeURIComponent(component);
    }
    x.send('id=' + encodeURIComponent(reviewSectionId) + '&text=' + encodeURIComponent(text) + opt_component + s_login);
    button.disabled = true;
  }
}

document.addEventListener('click', reviewSectionSelectByClick, false);
function reviewSectionSelectByClick(event) {
  var section = event.target;
  while (section && (!section.id || section.className.match(/\bpanel\b/ || section.tagName == 'INPUT'))) {
    if (section.previousSibling)
      section = section.previousSibling;
    else
      section = section.parentNode;
  }
  if (section && section.id && section != reviewer && section.id != 'alert')
    reviewSectionSelect(section.id)
}

window.addEventListener('hashchange', reviewSectionSelectByHash, false);
function reviewSectionSelectByHash(event) {
  if (location.hash.length > 1)
    reviewSectionSelect(location.hash.substr(1));
}

function reviewSectionSelect(s) {
  document.getElementById('reviewSection').textContent = 'Section "' + s + '" selected. Comment:';
  reviewSectionId = s;
}

function initReviewer() {
  reviewer = document.createElement('div');
  reviewer.id = 'reviewer';
  reviewer.onclick = function (event) { event.stopPropagation() };
  reviewer.innerHTML = '<input value="" id="reviewShowHide" type=button onclick=toggleReviewMode()> <span id="reviewSection">Click the location of the error to select it, then type your message here:</span> <input size=60 id=reviewCommentText onkeydown="if (event.keyCode == 13) { submitReviewComment(this, this.nextSibling.nextSibling) }"> <input value="Submit Review Comment" type=button onclick="submitReviewComment(this.previousSibling.previousSibling, this)"> <input value="Help" type=button onclick=showReviewHelp()>';
  document.body.appendChild(reviewer);
  var mode = getCookie('review');
  if (mode != 'off')
    mode = 'on';
  setReviewMode(mode);
}

var reviewerTimer = new Date();
initReviewer();
if (getCookie('profile') == '1')
  document.getElementsByTagName('h2')[0].textContent += '; reviewer.js: ' + (new Date() - reviewerTimer) + 'ms';
