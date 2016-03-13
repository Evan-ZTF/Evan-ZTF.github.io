var myApp = angular.module('myApp', ['ui.router']);
myApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login"); //默认路由指向
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "template/login/index.html",
      controller:function($scope,$state){
        $scope.sub=function(){
          $state.go('index')
        }
      }
    })
    .state('index', {
      url: "/index",
      templateUrl: "template/index/index.html",
      controller:function($scope,$state){
        $scope.title="我是主界面标题";
        $scope.logoff=function(){
          $state.go('login')
        }
      }
    })
});
