function getopgg() {
  const summonerNames = [...document.querySelectorAll("div[class*='playerList_playerName'] > div > div")].map(div => div.innerText);
  return `https://na.op.gg/multi/query=${encodeURIComponent(summonerNames.join(", "))}`;
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getopgg
  }, function ([{ result }]) {
    chrome.tabs.create({ url: result });
  });
});