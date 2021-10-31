function getopgg() {
  const summonerNames = [...document.querySelectorAll("div[class*='playerList_playerName'] > div > div")].map(div => div.innerText);
  return `https://na.op.gg/multi/query=${encodeURIComponent(summonerNames.join(", "))}`;
}

function checkSummonerNames() {
  const iconForSummonerNames = 'M12 14v8H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm9.446 7.032l1.504 1.504-1.414 1.414-1.504-1.504a4 4 0 1 1 1.414-1.414zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
  const iconForCeaNames = 'M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9.446 9.032l1.504 1.504-1.414 1.414-1.504-1.504a4 4 0 1 1 1.414-1.414zM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
  const elems = document.querySelectorAll(`path[d='${iconForCeaNames}']`)
  if (elems.length > 0) {
    alert('You must click the icon outlined in red to enable summoner names. Try again after enabling.')
    elems[0].parentElement.parentElement.parentElement.style.border = '4px solid red';
    return false
  }
  document.querySelectorAll(`path[d='${iconForSummonerNames}']`)[0].parentElement.parentElement.parentElement.style.border = '';
  return true
}

const changeListener = async () => {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab.url.indexOf('https://app.playcea.com/teams/') > -1) {
    chrome.action.setIcon(
      { path: 'images/icon-clickable.png' }
    )
  }
  else if (tab.url.indexOf('https://app.playcea.com/') > -1) {
    chrome.action.setIcon(
      { path: 'images/icon-active.png' }
    )
  }
  else {
    chrome.action.setIcon(
      { path: 'images/icon-inactive.png' }
    )
  }
}

chrome.webNavigation.onDOMContentLoaded.addListener(changeListener)
chrome.tabs.onActivated.addListener(changeListener)

chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get({
    clickbehavior: 'tab',
  }, function (items) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: getopgg
    }, function ([{ result }]) {
      switch (items.clickbehavior) {
        case "tab": {
          chrome.tabs.create({ url: result });
          break;
        }
        case "window": {
          chrome.windows.create({ url: result });
          break;
        }
        case "clipboard": {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [result],
            func: function copy(text) {
              var input = document.createElement('textarea');
              input.innerHTML = text;
              document.body.appendChild(input);
              input.select();
              var result = document.execCommand('copy');
              document.body.removeChild(input);
              return result;
            }
          })
        }
      }
    });
  });
});