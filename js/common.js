var formatDateTime = function(date) {
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? ('0' + m) : m;
  var d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  var h = date.getHours();
  var minute = date.getMinutes();
  minute = minute < 10 ? ('0' + minute) : minute;
  return y + '-' + m + '-' + d + '_' + h + ':' + minute + ":00";
};
var errorTime = 0;
var globalUserInfo = {
  nickname: "",
  sex: "",
  username: "",
  name: ""
}
var globalJWinfo = [{
  name: "个人资料",
  items: [{
    "title": "教务认证"
  }],
  show: false
}]
var config = {
  version: "1.0.2",
  host: "115.29.114.161"
}


function toUtf8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

function getTime() {
  var date = new Date();
  this.year = date.getFullYear();
  this.month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
  this.date = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  this.minute = date.getMinutes()
  return this.year + "-" + this.month + "-" + this.date + "T" + this.hour + ":" + this.minute + ":00"
}

function convertImgToBase64(url, callback, outputFormat) {
  var canvas = document.createElement('CANVAS'),
    ctx = canvas.getContext('2d'),
    img = new Image;
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
  img.src = url;
}

function checkConnection() {
  var networkState = navigator.connection.type;
  var states = {};
  states[Connection.UNKNOWN] = 'Unknown 连接';
  states[Connection.ETHERNET] = '以太网 连接';
  states[Connection.WIFI] = 'WiFi 连接';
  states[Connection.CELL_2G] = '2G 连接';
  states[Connection.CELL_3G] = '3G 连接';
  states[Connection.CELL_4G] = '4G 连接';
  states[Connection.CELL] = 'generic 连接';
  states[Connection.NONE] = '没有网络连接';

  // alert('网络状态: ' + states[networkState]);
  return states[networkState];
}
function alertErr(){
  window.onerror = function(msg, url, line) {
    var idx = url.lastIndexOf("/");
    if (idx > -1) {
      url = url.substring(idx + 1);
    }
    alert("ERROR in " + url + " (line #" + line + "): " + msg);
    return false;
  };
}
