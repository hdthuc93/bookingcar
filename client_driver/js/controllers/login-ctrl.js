var app = angular.module('driverApp')
app.controller('loginCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$timeout', '$location', 'helper', loginCtrl]);

function loginCtrl($scope, $cookieStore, $http, $rootScope, $timeout, $location, helper) {
  function init() {
    $scope.isRegister = false;
    $scope.username = "";
    $scope.password = "";
    $scope.item = {
      first_name: '',
      last_name: '',
      username: '',
      user_type: null,
      password: '',
      rePassword: '',
    };
  }
  init();

  $scope.login = function () {
    if ($scope.loginForm.$invalid) {
      return;
    }
    var body = {
      "username": $scope.username || null,
      "password": $scope.password || null
    }
    $http.post('http://localhost:3000/api/users/login', body).then(function successCallBack(res) {
      if (res.data.success) {
        var data = res.data.data;
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate()+1000);
        // Setting a cookie
        $rootScope.masterToken = data.token;
        $cookieStore.put(
          'userdata',
          {
            loggedIn: true,
            name: data.name,
            car_id: data.car_id,
            user_id: data.user_id,
            token: data.token
          },
          {
            'expires': expireDate
          });
        $location.path('/');
      } else {
        console.log('fail');
        helper.popup.info({ title: "Đăng nhập thất bại", message: res.data.msg, close: function () { return; } });
      }
    }, function errorCallback() {
      helper.popup.info({
        title: "Lỗi", message: "Xảy ra lỗi trong quá trình thực hiện, vui lòng thử lại.", close: function () {
          location.reload();
          return;
        }
      })
    });
  }

  $scope.logout = function () {
    
    $cookieStore.put('userdata', {});
    $location.path('/login');
  }
  // $scope.register = function () {
  //   if ($scope.registerForm.$error.required && $scope.registerForm.$error.required.length > 0) {
  //     $scope.registerForm[$scope.registerForm.$error.required[0].$name].$touched = true;
  //     return false;
  //   }
  //   if (typeof $scope.registerForm.$error.username !== 'undefined' && $scope.registerForm.$error.username.length > 0) {
  //     $scope.registerForm[$scope.registerForm.$error.username[0].$name].$touched = true;
  //     return false;
  //   }

  //   let param = angular.copy($scope.item);
  //   param.user_type = 0;

  //   $http.post("api/user", param).then(function (response) {
  //     helper.popup.info({ title: "Thông báo", message: response.data.message, close: function () { return; } });
  //     if (response.data.success) {
  //       init();
  //     };
  //   });

  // }
}



