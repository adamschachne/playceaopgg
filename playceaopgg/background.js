function getopgg() {
  const summonerNames = [...document.querySelectorAll("div[class*='playerList_playerName'] > div > div")].map(div => div.innerText);
  return `https://na.op.gg/multi/query=${encodeURIComponent(summonerNames.join(", "))}`;
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