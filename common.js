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

"use strict";

// format duration milliseconds
// 1 sec = 1000 ms
// 1hr = 3600 s = 3600000 ms
// 1min = 60 sec = 60000 ms;
function FormatDuration(d) {
  if (d < 0) {
    return "?";
  }
  // if it's less than 1 hr
  var divisor = d < 3600000 ? [60000, 1000] : [3600000, 60000];
  function pad(x) {
    return x < 10 ? "0" + x : x;
  }
  return (
    Math.floor(d / divisor[0]) +
    ":" +
    pad(Math.floor((d % divisor[0]) / divisor[1]))
  );
}

function ReverseFormatDuration(str) {
  var strft = str.split(":");
  var total_ms = 0;
  if (strft.length == 1) {
    return 0;
  }
  if (strft[0][0] == "0") {
    total_ms += parseInt(strft[0][1]) * 60000;
  } else {
    total_ms += parseInt(strft[0]) * 60000;
  }
  if (strft[1][0] == "0") {
    total_ms += parseInt(strft[1][1]) * 1000;
  } else {
    total_ms += parseInt(strft[1]) * 1000;
  }
  return total_ms;
}

exports.FormatDuration = FormatDuration;
exports.ReverseFormatDuration = ReverseFormatDuration;
