var myApp = angular.module('myApp', ['ui.router']);
myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login"); //默认路由指向
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "template/login/index.html",
      controller: function($scope, $state) {
        $scope.sub = function() {
          $state.go('index')
        }
      }
    })
    .state('index', {
      url: "/index",
      views: {
        'tab1': {
          templateUrl: "template/index/index.html",
          controller: function($scope, $state, $timeout, $window,$rootScope) {
            $rootScope.active='index';
            $scope.title = "我是主界面标题";
            $scope.getList = function() {
              $state.go('index.list')
            };
            $scope.logoff = function() {
              $state.go('login')
            };
            $scope.goBack = function() {
              $window.history.go(-1)
            }
            $scope.shopRegist = function() {
              $state.go('shop.regist');
              console.log(666)
            }
          }
        }
      }

    })
    .state('index.list', {
      url: "/list",
      views: {
        'tab1': {
          templateUrl: "template/index/list.html",
          controller: function($scope, $state) {
            $scope.listData = [{
              "title": "title1",
              "content": "content1"
            }, {
              "title": "title2",
              "content": "content2"
            }, {
              "title": "title3",
              "content": "content3"
            }, {
              "title": "title4",
              "content": "content4"
            }, {
              "title": "title5",
              "content": "content5"
            }]
          }
        }
      }
    })

    .state('shop', {
      url: "/shop",
      views: {
        'tab2': {
          templateUrl: "template/shop/index.html",
          controller: function($scope, $state) {

          }
        }
      }

    })
    .state('shop.regist', {
      url: "/regist",
      views: {
        'tab2': {
          templateUrl: "template/shop/regist.html",
          controller: function($scope, $state,$rootScope) {
            $rootScope.active='regist';
          }
        }
      }
    })
    .state('shop.info', {
      url: "/info",
      views: {
        'tab2': {
          templateUrl: "template/shop/info.html",
          controller: function($scope, $state,$rootScope) {
            $rootScope.active='info';
          }
        }
      }
    })
    .state('shop.couponupload', {
      url: "/couponupload",
      views: {
        'tab2': {
          templateUrl: "template/shop/couponupload.html",
          controller: function($scope, $state,$rootScope) {
            $rootScope.active='couponupload';

          }
        }
      }
    })


});
