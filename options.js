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

function getUrlTimeFromLocalStorage(url) {
  var url_list_json = JSON.parse(localStorage.url_list);
  return url_list_json[url];
}

function getUrlListFromLocalStorage() {
  var url_list_json = JSON.parse(localStorage.url_list);
  var str = "";
  for (let u in url_list_json) {
    str += u + "," + url_list_json[u] + "\n";
  }
  return str;
}

function createKeyValuePairFromString(str) {
  const table = str
    .split(/\n/) //["key:value","key:value"]
    .map((pair) => pair.split(",")); //[["key","value"],["key","value"]]
  const result = Object.fromEntries(table);

  return JSON.stringify(result);
}

function save_options() {
  localStorage["history_size"] = document.getElementById("history_size").value;
  var url_list = document.getElementById("url_list").value;
  // alert(createKeyValuePairFromString(url_list));
  localStorage["url_list"] = createKeyValuePairFromString(url_list);

  // refactor common
  var status = document.getElementById("status");
  status.innerHTML =
    '<div class="alert alert-success" role="alert">Options has been saved successfully!</div>';
  setTimeout(function () {
    status.innerHTML = "";
  }, 1450);
}

function restore_options() {
  var history_size = localStorage["history_size"];
  var url_list = getUrlListFromLocalStorage();
  if (!history_size) {
    return;
  }
  document.getElementById("history_size").value = history_size;
  document.getElementById("url_list").value = url_list;
}

document.addEventListener("DOMContentLoaded", restore_options);
document.querySelector("#save").addEventListener("click", save_options);
