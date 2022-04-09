/*
 * Copyright 2013 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// const { FormatDuration, ReverseFormatDuration } = require("./common");

function notificationAlert(id, title, message) {
  chrome.notifications.create(id, {
    type: "basic",
    iconUrl: chrome.extension.getURL("clock256.png"),
    title: title,
    message: message,
    contextMessage: message,
    priority: 0,
    isClickable: false,
  });

  var notifSound = new Audio("audio/notification.mp3");
  notifSound.play();
}

function getUrlTimeFromLocalStorage(url) {
  try {
    var url_list_json = JSON.parse(localStorage.url_list);
    if (url_list_json[url] == undefined) {
      return "extension";
    }
    return url_list_json[url];
  } catch (e) {
    return "extension";
  }
}

var History = {};

chrome.browserAction.setBadgeText({ text: "?" });
chrome.browserAction.setBadgeBackgroundColor({ color: "#777" });

function Update(t, tabId, url) {
  if (!url) {
    return;
  }
  if (tabId in History) {
    if (url == History[tabId][0][1]) {
      return;
    }
  } else {
    History[tabId] = [];
  }
  History[tabId].unshift([t, url]);

  var history_limit = parseInt(localStorage["history_size"]);
  if (!history_limit) {
    history_limit = 23;
  }
  while (History[tabId].length > history_limit) {
    History[tabId].pop();
  }

  chrome.browserAction.setBadgeText({ tabId: tabId, text: "0:00" });
  chrome.browserAction.setPopup({
    tabId: tabId,
    popup: "popup.html#tabId=" + tabId,
  });
}

function HandleUpdate(tabId, changeInfo, tab) {
  Update(new Date(), tabId, changeInfo.url);
}

function HandleRemove(tabId, removeInfo) {
  delete History[tabId];
}

function HandleReplace(addedTabId, removedTabId) {
  var t = new Date();
  delete History[removedTabId];
  chrome.tabs.get(addedTabId, function (tab) {
    console.log(tab.url);
    Update(t, addedTabId, tab.url);
  });
}

function UpdateBadges() {
  var now = new Date();
  for (tabId in History) {
    var deltaTime = now - History[tabId][0][0];
    var description = FormatDuration(deltaTime);
    var current_url = new URL(History[tabId][0][1]);
    var reversedDuration = ReverseFormatDuration(
      getUrlTimeFromLocalStorage(current_url.host)
    );
    if (reversedDuration > 0 && reversedDuration < deltaTime) {
      openTabs(tabId);
      notificationAlert(
        tabId,
        current_url.host,
        "This alert won't stop until you close"
      );
    }
    chrome.browserAction.setBadgeText({
      tabId: parseInt(tabId),
      text: description,
    });
  }
}

function openTabs(i) {
  // chrome.tabs.get(parseInt(i), async (tab) => {
  // let muted = !tab.mutedInfo.muted;
  // chrome.tabs.update(tab);
  // console.log(`Tab ${tab.id} is ${muted ? "muted" : "unmuted"}`);
  // });
  let creating = chrome.tabs.update(parseInt(i), { active: true });
}

setInterval(UpdateBadges, 1000);

chrome.tabs.onUpdated.addListener(HandleUpdate);
chrome.tabs.onRemoved.addListener(HandleRemove);
chrome.tabs.onReplaced.addListener(HandleReplace);
