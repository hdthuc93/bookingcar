var app = angular.module("bookingCar", [
    'ui.bootstrap',
    'ui.router', 'ui.router.state.events',
    'ngCookies',    
    'mod.helper']);
module.factory('Auth', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {
    var user;
    return {
        getUser: function () {
            return $cookieStore.get("userdata");
        },
        isLoggedIn: function () {
            if ($cookieStore.get('userdata')) {
                if ($cookieStore.get('userdata')) {
                    $rootScope.masterToken = $cookieStore.get('userdata').token;
                    $rootScope.masterUserRole = $cookieStore.get('userdata').user_type;
                    return $cookieStore.get('userdata').loggedIn;
                }
                return false;
            } else {
                return false;
            }
        }
    }
}]).run(['$rootScope', '$location', 'Auth', '$http', function ($rootScope, $location, Auth, $http) {
    $rootScope.$on('$locationChangeStart', function (event) {
        // if (!Auth.isLoggedIn()) {
        //     $location.path('/login');
        //     $rootScope.isLoggedIn = false;
        // }
        // else {
        //     $rootScope.masterUserName = Auth.getUser().name || "Người dùng";
        //     $rootScope.user_id = Auth.getUser().user_id || null;
        //     $rootScope.isLoggedIn = true;
        // }
    });
}]);

