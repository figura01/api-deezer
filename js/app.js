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

        .state('album', {
            url: '/album/:albumID/',
            templateUrl: '/templates/album.html',
            controller: function($scope, $stateParams) {
                // get the id
                $scope.id = $stateParams.albumID;

            }
        })

        .state('track', {
            url: '/track/:albumID/',
            templateUrl: '/templates/track.html',
            controller: function($scope, $stateParams) {
                // get the id
                $scope.id = $stateParams.albumID;

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
    $scope.hideResultAlbum = true;
    $scope.hideResultArtist = true;
    $scope.hideResultTrack = true;
    $scope.hideResultPopular = true;
    $scope.hideResultRank = true;

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
            $scope.hideResultAlbum = true;
            $scope.hideResultArtist = true;
            $scope.hideResultTrack = true;
            $scope.hideResultRank = true;
            $scope.hideResultPopular = true;
        }else{
            
            var request2 = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search/'+$scope.filter+'?q='+$scope.text;
            console.log("resquest2: "+request2);

            var temp2 =  search.requestToApi(request2);

            if($scope.filter == 'album'){
                $scope.hideResult1 = true;
                $scope.hideResultAlbum = false;
               
                $scope.hideResultArtist = true;
                $scope.hideResultTrack = true;
                $scope.hideResultRank = true;
                $scope.hideResultPopular = true;
            }else if($scope.filter == 'artist' ){
                $scope.hideResult1 = true;
                $scope.hideResultAlbum = true;
               
                $scope.hideResultArtist = false;
                $scope.hideResultTrack = true;
                $scope.hideResultRank = true;
                $scope.hideResultPopular = true;
            }else if($scope.filter == 'track' ){
                $scope.hideResult1 = true;
                $scope.hideResultAlbum = true;
               
                $scope.hideResultArtist = true;
                $scope.hideResultTrack = false;
                $scope.hideResultRank = true;
                $scope.hideResultPopular = true;
            }else if($scope.filter == 'popular'){
                $scope.hideResult1 = true;
                $scope.hideResultAlbum = true;
               
                $scope.hideResultArtist = true;
                $scope.hideResultTrack = true;
                $scope.hideResultRank = true;
                $scope.hideResultPopular = false;
            }else if($scope.filter == "rank") {
                $scope.hideResult1 = true;
                $scope.hideResultAlbum = true;
               
                $scope.hideResultArtist = true;
                $scope.hideResultTrack = true;
                $scope.hideResultRank = false;
                $scope.hideResultPopular = true;
            }else{
                $scope.hideResult1 = false;
                $scope.hideResultAlbum = true;
                $scope.hideResultArtist = true;
                $scope.hideResultTrack = true;
                $scope.hideResultRank = true;
                $scope.hideResultPopular = true;
            }
            
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

    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+this.id;
    console.log(request);


    artist.requestToApi = function(request){
        
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

    var temp =  artist.requestToApi(request);
    console.log(temp);

});

app.controller('albumController', function($scope,$http) {
    console.log("album Controller");
    console.log($scope.id);
    /* https://api.deezer.com/album/27 */
    var album = this;
    this.id = $scope.id;

    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/"+this.id;

    this.requestToApi = function(request){
        
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

    var temp = this.requestToApi(request);
});


app.controller('trackController', function($scope,$http) {
    console.log("track Controller");
    console.log($scope.id);

    /* https://api.deezer.com/album/27 */

    var convertTime = function(duration){

        var minutes = Math.trunc(duration/60);
        var secondes = duration % 60;

        if(secondes < 10){
            secondes = '0'+secondes;
        }

        var result = minutes+'m '+secondes;
        
        return result;
    }

    var track = this;
    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/"+$scope.id;



    track.requestToApi = function(request){
        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response.data);
                $scope.datas = response.data;
                $scope.preview = response.data.tracks.data[0].preview;
                $scope.titleTrak = response.data.tracks.data[0].title;
                $scope.titleAlbum = response.data.title;
                $scope.albumId = response.data.id;

                $scope.date = response.data.release_date

                $scope.cover = response.data.cover_small;

                $scope.duration = convertTime(response.data.tracks.data[0].duration);
                $scope.date = response.data.release_date;

                $scope.artiste_name = response.data.artist.name;
                $scope.artistId = response.data.artist.id;
                $scope.artistImg = response.data.artist.picture_small;


                angular.element(document.querySelector('#id'))
                var element = angular.element(document.querySelector('#track'));
                element.append('<audio controls="controls"> <source src='+$scope.preview+' /></audio>');
                console.log($scope.preview);
        }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
    };



    var temp =  track.requestToApi(request);
    console.log(temp);

});