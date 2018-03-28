var app = angular.module('routerApp', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
           
            templateUrl: '/templates/search.html',
            controller: 'searchController',
            controllerAs:'search'
        })

        .state('artist', {
            url: '/artist/:artistID/',
            templateUrl: '/templates/artiste.html',
            controller: function($scope, $stateParams) {
                // get the id
                $scope.id = $stateParams.artistID;

            }
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit       
        });

});

app.controller('searchController', function($scope,$http) {
    var search = this;
    //$('select').formSelect();
   
    /* https://api.deezer.com/search?q=artist:"aloe blacc" track:"i need a dollar" */
    /* hhttps://api.deezer.com/search/album?q=eminem */
    /* https://api.deezer.com/search?q=album:"good things" */
    /*	https://api.deezer.com/search?q=track:"i need a dollar"  */
    https://api.deezer.com/search?q=artist/:test

    //Properties
    search.musicList = [];
    search.index = 0;
    search.endList = false;


    $scope.filter = '';
    $scope.text= '';
    $scope.hideResult1 = true;
    $scope.hideResult2 = true;

    search.requestToApi = function(request){

    $http({
        method: 'GET',
        url: request
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log(response.data);
            $scope.datas = response.data; 
        }, function errorCallback(response) {
            console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    search.onSearch = function(search){
        console.log(search);
        console.log(search.text);
        console.log(typeof search.filter);
        console.log("envoie formulaire");

        $scope.filter = search.filter;
        $scope.text = search.text;
        
        console.log($scope.text);
        console.log($scope.filter);

        if( angular.isUndefined($scope.filter) ){
            var request = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q='+$scope.text;
            console.log("request: "+request);

            var temp =  search.requestToApi(request);

            console.log(temp);
            $scope.hideResult1 = false;
            $scope.hideResult2 = true;
        }else{
            
            var request2 = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/'+$scope.filter+'?q='+$scope.text;
            console.log("resquest2: "+request2);

            var temp2 =  search.requestToApi(request2);
            $scope.hideResult2 = false;
            $scope.hideResult1 = true;
            console.log(temp2);
        }



    };

    
})


app.controller('artistController', function($scope,$http) {
    console.log("artist controller");

    console.log($scope.id);


    var artist = this;

    this.id = $scope.id;

    /* https://api.deezer.com/artist/27 */

    artist.requestToApi = '';
    var requestShowArtist = function(request){
        $http({
            method: 'GET',
            url: request
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response.data);
                $scope.datas = response.data; 
            }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
    


});