// Saves options to chrome.storage
function save_options() {
  clearMsg();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var url      = document.getElementById('url').value;
  var ticket   = document.getElementById('ticket').value;

  //COLORS!!
  var colorTicketDefaults = [];
    colorTicketDefaults[1] = document.getElementById('defaultTicketColor_1').value;
    colorTicketDefaults[2] = document.getElementById('defaultTicketColor_2').value;
    colorTicketDefaults[3] = document.getElementById('defaultTicketColor_3').value;
    colorTicketDefaults[4] = document.getElementById('defaultTicketColor_4').value;
    colorTicketDefaults[5] = document.getElementById('defaultTicketColor_5').value;
    colorTicketDefaults[6] = document.getElementById('defaultTicketColor_6').value;
    colorTicketDefaults[7] = document.getElementById('defaultTicketColor_7').value;
    colorTicketDefaults[8] = document.getElementById('defaultTicketColor_8').value;
    colorTicketDefaults[9] = document.getElementById('defaultTicketColor_9').value;
    colorTicketDefaults[10] = document.getElementById('defaultTicketColor_10').value;
    colorTicketDefaults[11] = document.getElementById('defaultTicketColor_11').value;

  // a trailing slash in the url will mess up the extension -- remove it if it exists
  url = stripTrailingSlash(url);

  var credentials = username + ":" + password;
  credentials = btoa(credentials);

  chrome.storage.sync.set({
    jira_user: username,
    jira_password: password,
    jira_ticket: ticket,
    jira_url: url,
    jira_colorDefaults: colorTicketDefaults
  }, function() {
      // after we save the info, send a GET to JIRA and let's check if
      // a) the credentials work
      // b) the project exists
      chrome.runtime.sendMessage(
        {
          method: 'GET',
          action: 'xhttp',
          credentials: credentials,
          url: url + '/rest/api/2/issue/' + ticket
        },
        function(response) {
          console.log('response');
          console.log(response);
          if (response.errorMessages) {
            if (response.errorMessages[0] == "Invalid Credentials") {
              document.getElementById('errorMsg').className = "alert alert-danger fade-in";
            }
            else if (response.errorMessages[0] == "Issue Does Not Exist") {
              document.getElementById('warningMsg').className = "alert alert-warning fade-in";
            }
          }
          // If we didnt catch an error but got these statuses, throw error
          // Not sure what would trigger these but it's possible it could happen
          else if (response == 401 || response === 404) {
            document.getElementById('errorMsg').className = "alert alert-danger fade-in";
          }
          else if (response == "") {
            document.getElementById('errorMsg').className = "alert alert-danger fade-in";
          }
          else {
              // Show message to let user know options were saved.
              document.getElementById('successMsg').className = "alert alert-success fade-in";
          }
        }
      );
      if (isMessageDisplayed === false) {
        document.getElementById('errorMsg').className = "alert alert-danger fade-in";
      }
      //setTimeout(function(){ clearMsg(); }, 5000);
  });
}

function stripTrailingSlash(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

function isMessageDisplayed() {
  var successMsg = document.getElementById('successMsg');
  var warningMsg = document.getElementById('warningMsg');
  var errorMsg   = document.getElementById('errorMsg');
  if (successMsg.classList.contains('hidden') && warningMsg.classList.contains('hidden') && errorMsg.classList.contains('hidden')){
    return false
  }
  else {
    return true;
  }
}

function clearMsg() {
  document.getElementById('successMsg').className = "alert alert-success hidden";
  document.getElementById('warningMsg').className = "alert alert-warning hidden";
  document.getElementById('errorMsg').className   = "alert alert-warning hidden";
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Set default values
  chrome.storage.sync.get({
    jira_user: 'unknown',
    jira_password: 'unknown',
    jira_ticket: 'unknown',
    jira_url: 'unknown',
    jira_colorDefaults: 'unknown'
  }, function(items) {
    var username = items.jira_user;
    var password = items.jira_password;
    var ticket  = items.jira_ticket;
    var url      = items.jira_url;
    var colorTicketDefaults = items.jira_colorDefaults;

    if (username != 'unknown') {
      document.getElementById('username').value = username;
    }
    if (password != 'unknown') {
      document.getElementById('password').value = password;
    }
    if (ticket != 'unknown') {
      document.getElementById('ticket').value = ticket;
    }
    if (url != 'unknown') {
      document.getElementById('url').value = url;
    }
    if(colorTicketDefaults != 'unknown') {
        document.getElementById('defaultTicketColor_1').value = colorTicketDefaults[1];
        document.getElementById('defaultTicketColor_2').value = colorTicketDefaults[2];
        document.getElementById('defaultTicketColor_3').value = colorTicketDefaults[3];
        document.getElementById('defaultTicketColor_4').value = colorTicketDefaults[4];
        document.getElementById('defaultTicketColor_5').value = colorTicketDefaults[5];
        document.getElementById('defaultTicketColor_6').value = colorTicketDefaults[6];
        document.getElementById('defaultTicketColor_7').value = colorTicketDefaults[7];
        document.getElementById('defaultTicketColor_8').value = colorTicketDefaults[8];
        document.getElementById('defaultTicketColor_9').value = colorTicketDefaults[9];
        document.getElementById('defaultTicketColor_10').value = colorTicketDefaults[10];
        document.getElementById('defaultTicketColor_11').value = colorTicketDefaults[11];
    }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('save').addEventListener('kepress', function(e) {
  if (e.keyCode === 13) {
    save_options();
  }
})
