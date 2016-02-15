angular.module('myApp.controllers', [])
  .controller('tab1Controller', function($scope, $state, $ionicActionSheet, myHTTP, $ionicSlideBoxDelegate, showAlert, $ionicPopup, showLoading) {
  //   (function(){
  //     // jpushService.init()
  //     $ionicPopup.alert({
  //     title:'提示',
  //     template:'启动推送服务成功'
  //   });
  // })()
    $scope.goDetail = function(itemId, style) {
      console.log(itemId, style)
      $state.go("tab.orderDetail", {
        "itemId": itemId,
        "style": style
      })
    }

    getAD();
    myHTTP("http://" + config.host + "/papa/index.php?module=app&type=appconfig", function(data) {

        var data = data.data;
        console.log(data.version)
          // if(data.version!=config.version){
          //   showAlert("提示","发现新版本")
          // }
      })
      if(!window.localStorage.userid){
        $state.go("logins.login");
      }


    $scope.refresh = function() {
      getInfo()
      myHTTP("http://" + config.host + "/papa/index.php?module=app&type=advconfig", function(data) {
        var data = data.data;
        $ionicSlideBoxDelegate.update();
        // $ionicSlideBoxDelegate.loop(true);
        $ionicSlideBoxDelegate.$getByHandle("slideimgs").loop(true);
      })
      setTimeout(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000)

      //   $ionicSlideBoxDelegate.update();
    }

    function getAD() {
      // 使用缓存广告
      if (window.localStorage.ADInfo) {
        $scope.imgList = JSON.parse(window.localStorage.ADInfo)
      }
      //刷新广告
      myHTTP("http://" + config.host + "/papa/index.php?module=app&type=advconfig", function(data) {
        var data = data.data;
        $scope.imgList = data
        $ionicSlideBoxDelegate.update();
        var imgListLength = originImgListLength = data.length;
        var arr = [];
        data.map(function(value) {
          imgListLength--;
          convertImgToBase64(value.imgurl, function(data) {
            arr.push({
              'imgurl': data
            })
          })
          if (imgListLength == 0) {
            console.log("遍历完成")
              // 定时器每隔一秒检查图片是否全部转换完成base64
            var timeFlag = setInterval(function() {
              if (arr.length == originImgListLength) {
                console.log("图片全部转换成base64了");
                clearInterval(timeFlag);
                // 缓存广告到localStorage
                window.localStorage.ADInfo = JSON.stringify(arr);
              }
            }, 1000)
          }
        })
      }, function(data) {
        showAlert(data.desc);
      })
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      // showLoading.show()
      getInfo();
    })

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=GetItemList&userid=" + window.localStorage.userid, function(data) {
        $scope.listdatas = data.data
      })
    }

    $scope.load = function(item) {
      $state.go("tab.orderDetail", {
        'message': item.id
      });
    }
    $scope.publish = function() {
      var authStatus = true;
      globalJWinfo[0].items.map(function(value, key) {
        console.log(value.title)
        if (value.title == "教务认证") {
          authStatus = false;
        }
      })
      console.log(authStatus)
      if (!authStatus) {
        var confirmPopup = $ionicPopup.confirm({
          title: '提示',
          template: '请先进行教务认证',
          okText: "好",
          cancelText: "我再看看"
        });
        confirmPopup.then(function(res) {
          if (res) {
            $state.go("tab.bind")
            return false;
          } else {
            return false;
          }
        });
      } else {
        $ionicActionSheet.show({
          buttons: [{
            text: '快递代拿'
          }, {
            text: '其他'
          }, ],
          titleText: '请选择订单类型',
          cancelText: '取消',
          buttonClicked: function(index) {
            console.log(index)
            switch (index) {
              case 0:
                $state.go("tab.pubExpress");
                break;
              case 1:
                $state.go("tab.pubOther");
                break;
              default:
                return true

            }
            return true; //返回true回到界面
          }
        });
      }

    }
  })
  .controller('couponController', function($scope, $stateParams, myHTTP, $state, showAlert) {
    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Ticket&type=MyTicket&userid=" + window.localStorage.userid, function(data) {
        $scope.listdata = data.data
        console.log(data.data.length)
      }, function(data) {
        showAlert(data.desc)
      })
    }
    getInfo()
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {

      $('.row  .qr').each(function() {
        var that = $(this);
        var tCode = that.find('.tCode').text();
        that.qrcode({
          render: "canvas",
          width: 150, //宽度
          height: 150, //高度
          text: tCode //任意内容
        });
      })
    });


  })
  .controller('pubExpressController', function($scope, $stateParams, showAlert, myHTTP, $state, showLoading) {
    function check(Func) {
      if (info.title.length == 0) {
        showAlert("请输入标题");
        return false;
      } else if (info.contacts.length == 0) {
        showAlert("请输入联系人");
        return false;
      } else if (info.phone.length != 11) {
        showAlert("请输入11位手机号码");
        return false;
      } else if (info.adress.length == 0) {
        showAlert("请输入地址");
        return false;
      } else if (info.company.length == 0) {
        showAlert("请输入快递公司名字");
        return false;
      } else if (isNaN(Date.parse(info.finishtime))) {
        showAlert("时间必须大于当前时间且距离现在不超过一周");
        return false;
      } else if (info.pay.length == 0 || (isNaN(info.pay))||info.pay<=0) {
        showAlert("请输入佣金,佣金应该为大于0的数字");
        return false;
      } else if (info.reward.length < 0 || (isNaN(info.reward))||info.reward<=0) {
        showAlert("请输入赏金,赏金应该为大于等于0的数字");
        return false;
      } else {
        Func()
      }

    }

    $scope.reback = true;
    var info = {
      title: 1,
      contacts: 2,
      phone: 3,
      adress: 4,
      company: 5,
      finishtime: new Date(Date.parse(new Date())),
      pay: "6",
      bagdetail: 7,
      remark: 8,
      reward: 9
    }

    $scope.info = info;
    // $(document).ready(function() {
    //   setTimeout(function() {
    //     $('input[type="datetime-local"]').val(getTime())
    //     console.log($('input[type="datetime-local"]').val())
    //   })
    // })

    function sendInfo() {
      showLoading.show()
      $scope.reback = false;
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=PostItem&userid=" + window.localStorage.userid + "&contacts=" + info.contacts + "&phone=" + info.phone + "&title=" + info.title + "&pay=" + info.pay + "&reward=" + info.reward + "&remark=" + info.remark + "&company=" + info.company + "&address=" + info.adress + "&bagdetail=" + info.bagdetail + "&finishtime=" + formatDateTime(info.finishtime) + "&style=1", function(data) {
        showAlert(data.desc)
        $state.go('payIndex', {
          "itemId": data.data.itemId,
          "style": data.data.style
        })
        $scope.reback = true;
      }, function(data) {
        showAlert(data.desc)
      }, function() {
        $scope.reback = true;
      })
    }
    $scope.sub = function() {
      console.log(info.finishtime)
      check(
        sendInfo
      );

    }

  })
  .controller('pubOtherController', function($scope, $stateParams, showAlert, myHTTP, $state, showLoading,$filter) {
    function check(Func) {
      console.log(info.finishtime)
      if (info.title.length == 0) {
        showAlert("请输入标题");
        return false;
      } else if (info.contacts.length == 0) {
        showAlert("请输入联系人");
        return false;
      } else if (info.phone.length != 11) {
        showAlert("请输入11位手机号码");
        return false;
      } else if (isNaN(Date.parse(info.finishtime))) {
        showAlert("时间必须大于当前时间且距离现在不超过一周");
        return false;
      } else if (info.pay.length == 0 || (isNaN(info.pay))||info.pay<=0) {
        showAlert("请输入佣金,佣金应该为大于0的数字");
        return false;
      } else if (info.reward.length < 0 || (isNaN(info.reward))||info.reward<=0) {
        showAlert("请输入赏金,赏金应该为大于等于0的数字");
        return false;
      } else {
        Func()
      }

    }
    $scope.reback = true;
    var info = {
      title: 1,
      contacts: 2,
      phone: "11111111111",
      finishtime: new Date(Date.parse(new Date())),
      pay: "5",
      remark: 6,
      reward: 7
    }
    $scope.info = info;
    // $(document).ready(function() {
    //   setTimeout(function() {
    //     $('input[type="datetime-local"]').val(getTime())
    //     console.log($('input[type="datetime-local"]').val())
    //   })
    // })

    function sendInfo() {
      showLoading.show()
      $scope.reback = false;
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=PostItem&userid=" + window.localStorage.userid + "&contacts=" + info.contacts + "&phone=" + info.phone + "&title=" + info.title + "&pay=" + info.pay + "&reward=" + info.reward + "&remark=" + info.remark + "&finishtime=" + formatDateTime(info.finishtime) + "&style=0", function(data) {
        showAlert(data.desc)
        $state.go('payIndex', {
          "itemId": data.data.itemId,
          "style": data.data.style
        })
        $scope.reback = true;
      }, function(data) {
        showAlert(data.desc)
          // $scope.reback = true;
      }, function(data) {
        $scope.reback = true;
      })
    }
    $scope.sub = function() {
      check(
        sendInfo
      );

    }
  })
  .controller('tab2Controller', function($scope, $stateParams, $state, showAlert, myHTTP, showLoading) {
    $scope.refresh = function() {
      getInfo()
      setTimeout(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000)
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      getInfo()
    })

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Shop&type=GetShopList", function(data) {
        $scope.listdatas = data.data;
      }, function(data) {
        showAlert(data.desc);
      })
    }
    $scope.goDetail2 = function(listdata) {
      $state.go('tab.orderDetail2', {
        "shopId": listdata.shopId
      })
    }


  })
  .controller('withdrawCashController', function($scope,$state,myHTTP,showAlert,showLoading) {
    var info={
      username:"haha",
      money:"12",
      mymoney:"",
    }
    $scope.goBack=function(){
      $state.go("tab.tab1", {}, {
        reload: true
      });
    }
    $scope.info=info;
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show(500);
      myHTTP("http://"+config.host+"/papa/index.php?module=user&type=GetMyMoney&userid="+window.localStorage.userid,function(data){
        var data=data.data
        info.username=data.lastAccount
        info.mymoney=data.money
      },function(data){
        showAlert(data.desc)
      })
    })



    $scope.sub = function() {
      showLoading.show()
      myHTTP("http://"+config.host+"/papa/index.php?module=user&type=GetCash&userid="+window.localStorage.userid+"&account="+info.username+"&money="+info.money,function(data){
        console.log(data)
        showAlert(data.desc)
        myHTTP("http://"+config.host+"/papa/index.php?module=user&type=GetMyMoney&userid="+window.localStorage.userid,function(data){
          var data=data.data
          info.mymoney=data.money
        },function(data){
          showAlert(data.desc)
        })
      },function(data){
        showAlert(data.desc)
      })
    }
  })
  .controller('tab3Controller', function($scope, showAlert, myHTTP, $state, $ionicSlideBoxDelegate, $ionicScrollDelegate, showLoading) {
    $scope.state = 0; //tab切换
    $scope.listData = []
    $scope.listData2 = []

    $scope.slideHasChange = function(index) {
      $scope.state = index;
      $ionicScrollDelegate.scrollTop();
    }

    $scope.changeState = function(num) {
      $scope.state = num;
      console.log(num)
        // switch (num) {
        //   case 0:
        //   myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=GetOrderList&userid=" + window.localStorage.userid, function(data) {
        //     $scope.listData = data.data;
        //     $ionicSlideBoxDelegate.update();
        //   }, function(data) {
        //     showAlert(data.desc);
        //   })
        //     break;
        //     case 1:
        //     myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=GetWorkList&userid=" + window.localStorage.userid, function(data) {
        //       $scope.listData2 = data.data;
        //       $ionicSlideBoxDelegate.update();
        //     }, function(data) {
        //       showAlert(data.desc)
        //     })
        //   default:
      getInfo()

      // }
    }

    $scope.goDetail3 = function(item) {
      $state.go('tab.orderDetail3', {
        "itemId": item.itemId,
        "style": item.style,
        "title": item.status
      })
    }
    $scope.goDetail32 = function(item) {
      $state.go('tab.orderDetail32', {
        "itemId": item.itemId,
        "style": item.style,
        "title": item.status
      })
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show()
      getInfo()
    })

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=GetOrderList&userid=" + window.localStorage.userid, function(data) {
        $scope.listData = data.data;
        $ionicSlideBoxDelegate.update();
      }, function(data) {
        showAlert(data.desc);
      })
      myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=GetWorkList&userid=" + window.localStorage.userid, function(data) {
        $scope.listData2 = data.data;
        $ionicSlideBoxDelegate.update();
      }, function(data) {
        showAlert(data.desc)
      })
    }
    $scope.refresh = function() {
      getInfo()
      setTimeout(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000)
    }


  })
  .controller('tab4Controller', function($scope, $stateParams, $state, showAlert, myHTTP, showLoading,$ionicPopup) {
    $scope.refresh = function() {
      getInfo()
      setTimeout(function() {
        $scope.$broadcast('scroll.refreshComplete');
      }, 2000)
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      if (window.localStorage.userInfo) {
        var data = JSON.parse(window.localStorage.userInfo)
        showInfo(data)
      }
      getInfo()

    })
    function getInfo() {
      // 更新用户信息
      myHTTP("http://" + config.host + "/papa/index.php?module=user&type=userinfo&userid=" + window.localStorage.userid, function(data) {
        showInfo(data.data)
        window.localStorage.userInfo = JSON.stringify(data.data)
      }, function(data) {
        showAlert(data.desc)
      })
    }
    $scope.goSetting = function() {
      $state.go("tab.setting")
    }
    $scope.goWithDrawCash=function(){
      $state.go('tab.withdrawCash')
    }

    $scope.goto = function(title) {
      if (title == "教务认证") {
        $state.go("tab.bind");
      }
    }

    $scope.goCoupon = function() {
      $state.go("tab.coupon")
    }
    $scope.infoData = {
        "imgurl": null,
        "nickname": null,
        "score": "",
        "star": "",
        "username": ""
      }
      //用户信息缓存处理



    function showInfo(data) {
      $scope.infoData = {
        "imgurl": data.imgurl,
        "nickname": data.nickname,
        "score": data.score,
        "star": data.pjscore
      }
      $scope.JWinfo =[{
        name: "个人资料",
        items: [{
          "title": data.name
        }, {
          "title": data.sex
        }, {
          "title": data.username
        }],
        show: false
      }]

      if (data.isbind != 1) {
        $scope.JWinfo[0].items.push({
          "title": "教务认证"
        })
      }


    }

    $scope.logOn = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '注销',
        template: '您确定要退出帐号吗?',
        cancelText: '继续逛逛', // String (默认: 'Cancel')。一个取消按钮的文字。
        okText: '退出帐号', // String (默认: 'OK')。OK按钮的文字。
      });
      confirmPopup.then(function(res) {
        if (res) {
          window.localStorage.clear();
          // $ionicSideMenuDelegate.toggleLeft(false);
          $state.go("logins.login");
        }
      });

    }


    $scope.toggleGroup = function(group) {
      group.show = !group.show;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };

  })
  .controller('tabsController', function($scope, $stateParams, $state, showAlert, myHTTP, $ionicSideMenuDelegate, $ionicPopup) {
    $scope.goSetting = function() {
      $state.go("tab.setting")
    }
    $scope.goWithDrawCash=function(){
      $state.go('withdrawCash')
    }
    // $scope.globalUserInfo = globalUserInfo;
    // $scope.globalJWinfo = globalJWinfo;
    $scope.goto = function(title) {
      if (title == "教务认证") {
        $state.go("tab.bind");
      }
    }
    $scope.goCoupon = function() {
      $state.go("tab.coupon")
    }
    $scope.infoData = {
        "imgurl": null,
        "nickname": null,
        "score": "",
        "star": "",
        "username": ""
      }
      //用户信息缓存处理
    if (window.localStorage.userInfo) {
      var data = JSON.parse(window.localStorage.userInfo)
      showInfo(data)
    }
    // 更新用户信息
    myHTTP("http://" + config.host + "/papa/index.php?module=user&type=userinfo&userid=" + window.localStorage.userid, function(data) {
      showInfo(data.data)
      window.localStorage.userInfo = JSON.stringify(data.data)
    }, function(data) {
      showAlert(data.desc)
    })

    function showInfo(data) {
      $scope.infoData = {
        "imgurl": data.imgurl,
        "nickname": data.nickname,
        "score": data.score,
        "star": data.pjscore
      }
      $scope.globalUserInfo = globalUserInfo = data;
      $scope.globalJWinfo = globalJWinfo = [{
        name: "个人资料",
        items: [{
          "title": data.name
        }, {
          "title": data.sex
        }, {
          "title": data.username
        }],
        show: false
      }]
      if (data.isbind != 1) {
        $scope.globalJWinfo[0].items.push({
          "title": "教务认证"
        })
      }

    }

    $scope.logOn = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: '注销',
        template: '您确定要退出帐号吗?',
        cancelText: '继续逛逛', // String (默认: 'Cancel')。一个取消按钮的文字。
        okText: '退出帐号', // String (默认: 'OK')。OK按钮的文字。
      });
      confirmPopup.then(function(res) {
        if (res) {
          window.localStorage.clear();
          $ionicSideMenuDelegate.toggleLeft(false);
          $state.go("logins.login");
        }
      });

    }


    $scope.toggleGroup = function(group) {
      group.show = !group.show;
    };
    $scope.isGroupShown = function(group) {
      return group.show;
    };
  })
  .controller('settingController', function($scope, $stateParams, showAlert, myHTTP, $state, $ionicHistory,showLoading) {
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show(500)
    })
    var jsonParseData = JSON.parse(window.localStorage.userInfo);
    $scope.info = {
      airplaneMode: true,
      nickname: globalUserInfo.nickname,
    }
    $scope.goBack=function(){
      $state.go("tab.tab3", {}, {
        reload: true
      });
    }
    $scope.nickname = globalUserInfo
    $scope.sub = function() {
      if ($scope.nickname.nickname.length <= 12) {
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=userinfo&userid=" + window.localStorage.userid + "&nickname=" + $scope.nickname.nickname, function(data) {
          console.log($scope.nickname.nickname)
          showAlert(data.desc);
          globalUserInfo = $scope.nickname;
          // $ionicHistory.goBack() //回到主界面
          $state.go("tab.tab1", {}, {
            reload: true
          });
          // $ionicGoBack()

        })
      } else {
        showAlert("昵称不能超过12个字")
      }
    }
  })
  .controller('forgetController', function($scope, $stateParams, showAlert, myHTTP, $state, showLoading) {
    $scope.phone = ""
    $scope.password = ""
    $scope.password2 = ""
    $scope.code = ""
    var codeid = ""
    $scope.time = 60;

    function check(phone, psd1, psd2, code, Func) {
      if (phone.length != 11) {
        showAlert("请输入11位手机号码")
      } else if (psd1.length < 6 || psd1.length > 16) {
        showAlert("请输入6~16位密码")
      } else if (psd1 != psd2) {
        showAlert("密码不一致,请重新输入")
      } else {
        Func()
      }
    }
    $scope.getCode = function(phone, psd1, psd2, code) {
      check(phone, psd1, psd2, code, function() {
        //验证码接口

        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=forget&username=" + phone, function(data) {
          console.log(data)
          var time = setInterval(function() {
            $scope.$apply(function() {
              $scope.time = $scope.time - 1;
              if ($scope.time == 0) {
                clearInterval(time)
                $scope.time = 60;
              }
            })
          }, 1000)
          showAlert(data.desc)
          codeid = data.data.codeid;
        }, function(data) {
          showAlert(data.desc)
        })

      })
    }
    $scope.next = function(phone, psd1, psd2, code) {
      check(phone, psd1, psd2, code, function() {
        // 注册接口
        if (code.length == 0 || code.length != 4) {
          showAlert("请输入4位验证码")
          return false;
        }
        showLoading.show()
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=forget&username=" + phone + '&code=' + code + '&codeId=' + codeid + '&password=' + psd1, function(data) {
          showAlert(data.desc)
          window.localStorage.userid = data.data.userid;
          window.localStorage.authid = data.data.authid;
          window.localStorage.scretid = data.data.scretid;
          $state.go("logins.login")
        }, function(data) {
          showAlert(data.desc)
        })
      })
    }
  })

.controller('bindController', function($scope, $stateParams, showAlert, myHTTP) {
    $scope.xuehao = ""
    $scope.password = ""
    $scope.code = ''
    var codeid = ""
    var clickState = 1;
    getImgData()
    $scope.codeSrc = ""

    function getImgData() {
      console.log('getImgData')
      myHTTP("http://" + config.host + "/papa/index.php?module=user&type=bind&userid=" + window.localStorage.userid, function(data) {
        codeid = data.data.codeid
        $scope.codeSrc = "data:image/png;base64," + data.data.imgData;
      }, function(data) {
        showAlert(data.desc)
      })
    }


    $scope.refreshImg = function() {
      getImgData()
    }
    $scope.sub = function(xuehao, password, code) {
      function checkBind(result) {
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=userinfo&userid=" + window.localStorage.userid, function(data) {
          var data = data.data;
          //   globalJWinfo= [
          //    {
          //      name: "个人资料",
          //      items: [{"title":data.name},{"title":data.sex},{"title":data.username}],
          //      show: false
          //    }
          //  ]
          console.log(result)
          if (result == "success") {
            if (data.isbind == 1) {
              var arr = []
              globalJWinfo[0].items.map(function(data, key) {
                console.log(data)
                if (data.title != "教务认证") {
                  arr.push(data)
                }
              })
              globalJWinfo[0].items = arr;
            }
          }
        })
      }
      if (clickState == 1) {
        clickState = 0;
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=bind&userid=" + window.localStorage.userid + "&authid=" + window.localStorage.authid + "&xh=" + xuehao + "&pw=" + password + "&code=" + code + "&codeid=" + codeid, function(data) {
          clickState = 1;
          showAlert(data.desc)
          checkBind(data.result)
        }, function(data) {
          clickState = 1;
          console.log(data)
          showAlert(data.desc)
          getImgData()
          checkBind(data.result)
        })
      }
    }
  })
  .controller('registController', function($scope, $stateParams, myHTTP, $state, showAlert, showLoading) {
    $scope.phone = ""
    $scope.password = ""
    $scope.password2 = ""
    $scope.code = ""
    $scope.time = 60;
    var codeid = ""

    function check(phone, psd1, psd2, code, Func) {
      if (phone.length != 11) {
        showAlert("请输入11位手机号码")
      } else if (psd1.length < 6 || psd1.length > 16) {
        showAlert("请输入6~16位密码")
      } else if (psd1 != psd2) {
        showAlert("密码不一致,请重新输入")
      } else {
        Func()
      }
    }
    $scope.getCode = function(phone, psd1, psd2, code) {
      check(phone, psd1, psd2, code, function() {
        //验证码接口
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=register&username=" + phone, function(data) {
          console.log(data)
          var time = setInterval(function() {
            $scope.$apply(function() {
              $scope.time = $scope.time - 1;
              if ($scope.time == 0) {
                clearInterval(time)
                $scope.time = 60;
              }
            })
          }, 1000)
          showAlert(data.desc)
          codeid = data.data.codeid;
        }, function(data) {
          showAlert(data.desc)
        })

      })
    }
    $scope.next = function(phone, psd1, psd2, code) {
      check(phone, psd1, psd2, code, function() {
        // 注册接口
        if (code.length == 0 || code.length != 4) {
          showAlert("请输入4位验证码")
          return false;
        }
        showLoading.show()
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=register&username=" + phone + '&code=' + code + '&codeId=' + codeid + '&password=' + psd1, function(data) {
          showAlert(data.desc)
          window.localStorage.userid = data.data.userid;
          window.localStorage.authid = data.data.authid;
          window.localStorage.scretid = data.data.scretid;
          $state.go("logins.login")
        }, function(data) {
          showAlert(data.desc)
        })
      })
    }
  })
  .controller('orderDetailController', function($scope, $stateParams, myHTTP, $state, showAlert, showLoading) {
    console.log($stateParams.itemId, $stateParams.style)
    $scope.rush = function(item) {
      // itemId,shopId,style
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=RushTicket&userId=" + window.localStorage.userid + "&itemId=" + item.itemId + "&shopId=" + item.shopId + "&style=" + item.style, function(data) {
        showAlert(data.desc)
      }, function(data) {
        showAlert(data.desc)
      }, function() {
        $state.go('tab.tab1')
      })
    }
    $scope.order = function(item) {
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=RushOrder&userId=" + window.localStorage.userid + "&itemId=" + item.itemId + "&style=" + item.style + "&rushtoken=" + item.rushtoken, function(data) {
        showAlert(data.desc);
        $state.go("tab.tab1")
      }, function(data) {
        $state.go("tab.tab1")
        showAlert(data.desc);
      })
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show()
      getInfo()
    })

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Item&type=ItemDetail&userid=" + window.localStorage.userid + "&itemId=" + $stateParams.itemId + "&style=" + $stateParams.style, function(data) {
        var data = data.data;
        $scope.data = data;
        console.log(data)
      })
    }


  })
  .controller('orderDetail2Controller', function($scope, $stateParams, showAlert, myHTTP, showLoading) {
    console.log($stateParams.shopId)
    $scope.refresh = function() {
      getInfo();
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show()
      getInfo()
    })

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Shop&type=GetShopInfo&shopId=" + $stateParams.shopId, function(data) {
        $scope.info = data.data;
      })
      myHTTP("http://" + config.host + "/papa/index.php?module=Shop&type=GetDishes&shopId=" + $stateParams.shopId, function(data) {
        $scope.listdatas = data.data;
      }, "", function() {
        console.log("停止下拉刷新")
        $scope.$broadcast('scroll.refreshComplete');
      })
      myHTTP("http://" + config.host + "/papa/index.php?module=Shop&type=GetNewAct&shopId=" + $stateParams.shopId, function(data) {
        $scope.artDatas = data.data;
      })

    }
  })
  .controller('orderDetail3Controller', function($scope, $stateParams, showAlert, myHTTP, $ionicNavBarDelegate, $state, showLoading) {
    $scope.data = {
      "title": " ",
      "contacts": " ",
      "phone": " ",
      "username": " ",
      "pay": " ",
      "reward": " ",
      "remark": " ",
      "style": " ",
      "createtime": "",
      "finishtime": "",
      "employee": " ",
      "employeephone": " ",
      "company": " ",
      "address": " ",
      "bagdetail": " "
    }
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show()
      getInfo()
    })
    $scope.pay = function(data) {
      console.log(data.itemId)
      $state.go('payIndex', {
        "itemId":data.itemId,
        "style":data.style
      })
    }
    $scope.status = $stateParams.title
    console.log($stateParams.itemId, $stateParams.style)
    $scope.confirm = function(data) {
      console.log("confirm")
      myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=FinishOrder&userid=" + window.localStorage.userid + "&itemId=" + data.itemId + "&style=" + data.style, function(data) {
        showAlert(data.desc)
        $state.go('tab.tab3')
      }, function(data) {
        showAlert(data.desc)
      })
    }
    $scope.cancel = function(data) {
      console.log("cancel")
      myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=CancelOrder&userid=" + window.localStorage.userid + "&itemId=" + data.itemId + "&style=" + data.style, function(data) {
        showAlert(data.desc)
        $state.go('tab.tab3')
      }, function(data) {
        showAlert(data.desc)
      })
      console.log(data)
    }

    function getInfo() {
      myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=OrderDetail&userid=" + window.localStorage.userid + "&itemId=" + $stateParams.itemId + "&style=" + $stateParams.style, function(data) {
        var data = data.data;
        $scope.data = data;
        console.log(data)
      }, function(data) {
        showAlert(data.desc)
      })
    }


  })

.controller('orderDetail32Controller', function($scope, $stateParams, showAlert, myHTTP, $ionicNavBarDelegate, $state, showLoading) {
  $scope.status = $stateParams.title;
  $scope.data = {
    "title": " ",
    "contacts": " ",
    "phone": " ",
    "username": " ",
    "pay": " ",
    "reward": " ",
    "remark": " ",
    "style": " ",
    "createtime": "",
    "finishtime": "",
    "boss": " ",
    "bossphone": " ",
    "company": " ",
    "address": " ",
    "bagdetail": " "
  }
  $scope.$on("$ionicView.beforeEnter", function() {
    showLoading.show()
    getInfo()
  })
  $scope.confirm = function(data) {
    console.log("confirm")
    myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=FinishOrder&userid=" + window.localStorage.userid + "&itemId=" + data.itemId + "&style=" + data.style, function(data) {
      showAlert(data.desc)
      $state.go('tab.tab3')
    }, function(data) {
      showAlert(data.desc)
    })
  }
  $scope.cancel = function(data) {
    console.log("cancel")
    myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=CancelOrder&userid=" + window.localStorage.userid + "&itemId=" + data.itemId + "&style=" + data.style, function(data) {
      showAlert(data.desc)
      $state.go('tab.tab3')
    }, function(data) {
      showAlert(data.desc)
    })
    console.log(data)
  }

  function getInfo() {
    myHTTP("http://" + config.host + "/papa/index.php?module=Order&type=WorkDetail&userid=" + window.localStorage.userid + "&itemId=" + $stateParams.itemId + "&style=" + $stateParams.style, function(data) {
      var data = data.data;
      $scope.data = data;
      console.log(data)
    }, function(data) {
      showAlert(data.desc)
    })
  }




})


.controller('payIndexController', function($scope, $stateParams, showAlert, myHTTP, $state, $ionicHistory, showLoading, $http) {
    $scope.$on("$ionicView.beforeEnter", function() {
      showLoading.show(500)
    })
    console.log($stateParams.itemId, $stateParams.style)
    $scope.chooseType = "1"
    $scope.payment="wx"
    $scope.toggleType = function(index) {
      console.log(index)
      switch (index) {
        case 1:
          $scope.chooseType = "1"
          console.log("微信");
          $scope.payment="wx"
          break;
        case 2:
          $scope.chooseType = "2"
          console.log("支付宝");
          $scope.payment="alipay"
          break;
      }
    }
    $scope.channel=function(){
      console.log(111)
      // $ionicHistory.goBack(-2)
      $state.go('tab.tab1')
    }
    $scope.sub = function() {
      console.log($stateParams.itemId)
      console.log($scope.payment)
      showLoading.show()
      $http({
        url:"http://"+config.host+"/papa/index.php?module=Item&type=PayItem&userid="+window.localStorage.userid+"&itemId="+$stateParams.itemId+"&style="+$stateParams.style+"&&channel="+$scope.payment,
        method:"GET",
        timeout:4000
      }).success(function(data){
        alert("准备发起支付")
        if(data.result!="success"){
          showLoading.hide()
          showAlert(data.desc)
          return false;
        }
        try {
          pingpp.createPayment(data.data, function(result) {
            showLoading.hide()
            showAlert("支付成功")
            $state.go('tab.tab1')
            console.log(result)

            // CommonJs.AlertPopup('suc: ' + result); //"success"
          }, function(result) {
            showLoading.hide()
            console.log(result)
            showAlert("支付失败")
            // CommonJs.AlertPopup('err: ' + result); //"fail"|"cancel"|"invalid"
          });
        } catch (e) {
          showAlert("ping++错误")
        }
      }).error(function(){
        showAlert("网络不好,请重试")
      })

    }
  })
  .controller('loginController', function($scope, $stateParams, $state, showAlert, myHTTP, showLoading,showBottom) {
    if(window.localStorage.userid){
      showLoading.show()
      setTimeout(function(){
        $state.go("tab.tab1");
      },500)
     }

    $scope.phone = "11111111111"
    $scope.password = "111111"

    $scope.login = function(phone, password) {
      if (phone.length != 11) {
        showAlert("请输入11位手机号码")
      } else if (password.length < 6 || password.length > 16) {
        showAlert("请输入6~16位密码")
      } else {
        myHTTP("http://" + config.host + "/papa/index.php?module=user&type=login&username=" + phone + '&password=' + password, function(data) {
          // showAlert("提示",data.desc)
          showLoading.show()
          window.localStorage.userid = data.data.userid;
          window.localStorage.authid = data.data.authid;
          window.localStorage.scretid = data.data.scretid;
          setTimeout(function(){
            $state.go("tab.tab1", {}, {
              reload: true
            });
          },500)
        }, function(data) {
          showAlert(data.desc)
        })
      }
    }
  })
