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
      controller:function($scope,$state,$timeout,$window){
        $scope.title="我是主界面标题";
        $scope.getList=function(){
          $state.go('index.list')
        };
        $scope.logoff=function(){
          $state.go('login')
        };
        $scope.goBack=function(){
          $window.history.go(-1)
        }
      }
    })
    .state('index.list', {
      url: "/index/list",
      views:{
        '':{
          templateUrl: "template/index/list.html",
          controller:function($scope,$state){
            $scope.listData=[
              {"title":"title1","content":"content1"},
              {"title":"title2","content":"content2"},
              {"title":"title3","content":"content3"},
              {"title":"title4","content":"content4"},
              {"title":"title5","content":"content5"}
            ]
          }
        }
      }
    })
});
