var app = angular.module("driverApp", [
    'ui.bootstrap',
    'ui.router', 
    'ui.router.state.events',
    'ui.grid', 
    'ui.grid.selection', 
    'ui.grid.resizeColumns',
    'ngCookies',    
    'mod.helper', 'firebase']);
module.factory('Auth', ['$cookieStore', '$rootScope', function ($cookieStore, $rootScope) {
    var user;
    return {
        getUser: function () { 
            return $cookieStore.get("userdata");
        },
        isLoggedIn: function () {
            if ($cookieStore.get('userdata')) {
                var data = $cookieStore.get('userdata');
                var expireDate = new Date(data.expire);
                var currentDate = new Date();
                if(expireDate<currentDate){ console.log(1111)
                    $cookieStore.put('userdata', {});  
                    return false;
                }
                if(data.loggedIn){
                    $rootScope.userData = angular.copy(data);
                    return true;
                }else{
                    $cookieStore.put('userdata', {});  
                    return false;
                    $rootScope.userData = null;
                }
                $cookieStore.put('userdata', {});  
                return false;
            } else {
                $cookieStore.put('userdata', {});  
                return false;
            }
        }
    }
}]).run(['$rootScope', '$location', 'Auth', '$http', function ($rootScope, $location, Auth, $http, $cookieStore) {
    $rootScope.$on('$locationChangeStart', function (event) {
        if (!Auth.isLoggedIn()) {
            $location.path('/login');
            $rootScope.isLoggedIn = false;
        }
        else {
            $rootScope.userData = Auth.getUser();
            $rootScope.isLoggedIn = true;
        }
    });
}]);

