myapp.factory('myHTTP', function($http, showAlert, showLoading, showBottom) {
  return function(url, Func1, Func2, Func3, Func4) {
    if (typeof cordova != 'undefined') {
      if (checkConnection() == "没有网络连接") {
        myToast("没有网络连接")
        return false;
      }
    }
    $http({
      url: url,
      method: "GET",
      timeout: 4000
    }).success(function(data) {
      if (typeof data !== "object") {
        myToast("出现异常")
        return false;
      }
      showLoading.hide()
      console.log(data)
      if (data.result == "success") {
        if (Func1) {
          Func1(data)
        }
      } else {
        if (Func2) {
          Func2(data)
        }
      }
    }).error(function(data) {
      console.log("失败回调")
      $http({
        url: url,
        method: "GET",
        timeout: 4000
      }).success(function(data) {
        showLoading.hide()
        console.log("我成功啦~")
        if (typeof data !== "object") {
          myToast("出现异常")
          return false;
        }
        showLoading.hide()
        console.log(data)
        if (data.result == "success") {
          if (Func1) {
            Func1(data)
          }
        } else {
          if (Func2) {
            Func2(data)
          }
        }
      }).error(function() {
        console.log(Func4)
        if (Func4) {
          Func4()
        }
        if (errorTime == 0 || errorTime == 4) {
          myToast("网络不好,请重试")
        }
        if (errorTime == 4) {
          setTimeout(function() {
            errorTime = 0;
          }, 2000)
        }
        errorTime++;
        showLoading.hide()
        console.log("我失败了...")
      })
    }).finally(function(data) {
      console.log("finally")
      if (Func3) {
        console.log('333')
        Func3(data)
      }
    })
  }

})
myapp.factory('showAlert', function($ionicPopup) {
  return function(text, title) {
    var thisTitle = "提示"
    if (title) {
      thisTitle = title
    }
    var alertPopup = $ionicPopup.alert({
      title: thisTitle,
      template: text
    });
    alertPopup.then(function(res) {
      //点击回调
      // console.log('Thank you for not eating my delicious ice cream cone');
    });
  }



})

myapp.factory('showLoading', function($ionicLoading) {
  return {
    show: function(time) {
      $ionicLoading.show({
        template: '<ion-spinner icon="ios"></ion-spinner>',
        duration: time || 3000,
        hideOnStateChange: true
      });
    },
    hide: function() {
      $ionicLoading.hide({});
    }
  }
})
myapp.factory("showBottom", function(showAlert) {
    return function(text) {
      try {
        window.plugins.toast.showWithOptions({
          message: text,
          duration: "short",
          position: "bottom",
          addPixelsY: -40, // added a negative value to move it up a bit (default 0)
          styling: {
            opacity: 0.7, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
            backgroundColor: '#000000', // make sure you use #RRGGBB. Default #333333
            cornerRadius: 0, // minimum is 0 (square). iOS default 20, Android default 100
            horizontalPadding: 16, // iOS default 16, Android default 50
            verticalPadding: 12 // iOS default 12, Android default 30
          }
        });
      } catch (e) {
        showAlert(text)
      }
    }
  })

//
//   myapp.factory('jpushService',['$http','$window',function($http,$window){
//   	var jpushServiceFactory={};
//
// 	//var jpushapi=$window.plugins.jPushPlugin;
//
// 	//启动极光推送
// 	var _init=function(){
// 		$window.plugins.jPushPlugin.init();
// 		$window.plugins.jPushPlugin.setDebugMode(true);
// 	}
//
// 	//停止极光推送
// 	var _stopPush=function(){
// 		$window.plugins.jPushPlugin.stopPush();
// 	}
//
// 	//重启极光推送
// 	var _resumePush=function(){
// 		$window.plugins.jPushPlugin.resumePush();
// 	}
//
// 	//设置标签和别名
// 	var _setTagsWithAlias=function(tags,alias){
// 		$window.plugins.jPushPlugin.setTagsWithAlias(tags,alias);
// 	}
//
// 	//设置标签
// 	var _setTags=function(tags){
// 		$window.plugins.jPushPlugin.setTags(tags);
// 	}
//
// 	//设置别名
// 	var _setAlias=function(alias){
// 		$window.plugins.jPushPlugin.setAlias(alias);
// 	}
//
//
// 	jpushServiceFactory.init=_init;
// 	jpushServiceFactory.stopPush=_stopPush;
// 	jpushServiceFactory.resumePush=_resumePush;
//
// 	jpushServiceFactory.setTagsWithAlias=_setTagsWithAlias;
// 	jpushServiceFactory.setTags=_setTags;
// 	jpushServiceFactory.setAlias=_setAlias;
//
// 	return jpushServiceFactory;
// }]);
