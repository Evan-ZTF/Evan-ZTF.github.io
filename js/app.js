console.log("😂");
var myapp = angular.module('myApp', ['ionic', 'myApp.controllers'])
myapp.run(function($ionicPlatform, $ionicPopup) {

  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    // //启动极光推送服务
    // function startPushServe(){
    //   // alert('开启推送开始')
    //   window.plugins.jPushPlugin.init();
    //   window.plugins.jPushPlugin.setDebugMode(true);
    //   // alert('开启推送成功')
    // }

    // alert(checkConnection())
    // showAlert("标题","内容",$ionicPopup)
    // showAlert("标题",checkConnection(),$ionicPopup)

    // checkConnection();
  });
  // alertErr()
})
myapp.directive('onFinishRenderFilters', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element, attr) {
      if (scope.$last === true) {
        $timeout(function() {
          scope.$emit('ngRepeatFinished');
        });
      }
    }
  };
});
myapp.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value) {
          $rootScope.hideTabs = value;
        });
      });

      scope.$on('$ionicView.beforeLeave', function() {
        $rootScope.hideTabs = false;
      });
    }
  };
});
myapp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  //   $ionicConfigProvider.views.maxCache(0);
  $ionicConfigProvider.platform.android.tabs.position('standard');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.style("standard");
  // $ionicConfigProvider.scrolling.jsScrolling(false);//原生滚动
  //   $ionicConfigProvider.views.swipeBackEnabled(false);
  // 流畅开始
  // $ionicNativeTransitionsProvider.setDefaultOptions({
  //       duration: 300, // in milliseconds (ms), default 400,
  //       slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
  //       iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
  //       androiddelay: -1, // same as above but for Android, default -1
  //       winphonedelay: -1, // same as above but for Windows Phone, default -1,
  //       fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
  //       fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
  //       triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
  //       backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
  //   });
  //   $ionicNativeTransitionsProvider.setDefaultTransition({
  //      type: 'slide',
  //      direction: 'left'
  //  });
  //  $ionicNativeTransitionsProvider.setDefaultBackTransition({
  //      type: 'slide',
  //      direction: 'right'
  //  });

  //流畅结束

  $stateProvider
    .state('tab', {
      url: "/tab",
      abstract: false,
      templateUrl: "templates/tabs.html",
      controller: 'tabsController'

    })
    .state('logins', {
      url: "/logins",
      abstract: true,
      templateUrl: "templates/logins.html",
    })
    .state('logins.login', {
      url: '/login',
      cache: false,
      views: {
        'logins-login1': {
          templateUrl: "templates/login.html",
          controller: 'loginController'
        }
      }
    })
    .state('logins.regist', {
      url: '/regist',
      views: {
        'logins-login1': {
          templateUrl: "templates/regist.html",
          controller: 'registController'
        }
      }
    })
    .state('logins.agreenment', {
      url: '/agreement',
      views: {
        'logins-login1': {
          templateUrl: "templates/agreement.html"
          // controller: 'agreementController'
        }
      }
    })
    .state('logins.forget', {
      url: '/forget',
      views: {
        'logins-login1': {
          templateUrl: "templates/forget.html",
          controller: 'forgetController'
        }
      }
    })
    .state('tab.bind', {
      url: '/bind',
      views: {
        'tab-tab1': {
          templateUrl: "templates/bind.html",
          controller: 'bindController'
        }
      }
    })
    // params:{'message':"1212"},
    .state('tab.tab1', {
      url: '/tab1',
      views: {
        'tab-tab1': {
          templateUrl: "templates/tab-tab1.html",
          controller: 'tab1Controller'
        }
      }
      // ,
      // nativeTransitions:null
    })
    .state('tab.pubExpress', {
      url: '/pubExpress',
      views: {
        'tab-tab1': {
          templateUrl: "templates/pubExpress.html",
          controller: 'pubExpressController'
        }
      }
    })
    .state('tab.pubOther', {
      url: '/pubOther',
      views: {
        'tab-tab1': {
          templateUrl: "templates/pubOther.html",
          controller: 'pubOtherController'
        }
      }
    })
    .state('setting', {
      url: '/setting',
      templateUrl: "templates/setting.html",
      controller: 'settingController'

    })
    .state('payIndex', {
      url: '/payIndex',
      params: {
        "itemId": null,
        "style": null
      },
      templateUrl: "templates/payIndex.html",
      controller: 'payIndexController'
    })
    .state('tab.coupon', {
      url: '/coupon',
      views: {
        'tab-tab1': {
          templateUrl: "templates/coupon.html",
          controller: 'couponController'
        }
      }
    })
    .state('tab.tab2', {
      url: '/tab2',
      views: {
        'tab-tab2': {
          templateUrl: "templates/tab-tab2.html",
          controller: 'tab2Controller'
        }
      }
      // ,
      // nativeTransitions:null
    })
    .state('tab.orderDetail', {
      url: '/orderDetail',
      params: {
        "itemId": null,
        "style": null
      },
      views: {
        'tab-tab1': {
          templateUrl: "templates/orderDetail.html",
          controller: 'orderDetailController'
        }
      }
    })
    .state('tab.orderDetail2', {
      url: '/orderDetail2',
      params: {
        "shopId": null,
      },
      views: {
        'tab-tab2': {
          templateUrl: "templates/orderDetail2.html",
          controller: 'orderDetail2Controller'
        }
      }
    })
    .state('tab.orderDetail3', {
      url: '/orderDetail3',
      params: {
        "itemId": null,
        "style": null,
        "title": null
      },
      views: {
        'tab-tab3': {
          templateUrl: "templates/orderDetail3.html",
          controller: 'orderDetail3Controller'
        }
      }
    })
    .state('tab.orderDetail32', {
      url: '/orderDetail32',
      params: {
        "itemId": null,
        "style": null,
        "title": null
      },
      views: {
        'tab-tab3': {
          templateUrl: "templates/orderDetail32.html",
          controller: 'orderDetail32Controller'
        }
      }
    })
    .state('tab.tab3', {
      url: '/tab3',
      views: {
        'tab-tab3': {
          templateUrl: "templates/tab-tab3.html",
          controller: 'tab3Controller'
        }
      }
      // ,
      // nativeTransitions:null
    })

  $urlRouterProvider.otherwise('/logins/login');

});
