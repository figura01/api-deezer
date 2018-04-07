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
            url: '/track/:trackID/',
            templateUrl: '/templates/track.html',
            controller: function($scope, $stateParams) {
                // get the id
                $scope.id = $stateParams.trackID;

            }
        })

        .state('favoris', {
            url: '/favoris',
            templateUrl: '/templates/favoris.html',
            controller: 'favorisController',
            controllerAs: 'favoris'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('about', {
            // we'll get to this in a bit       
        });

});

app.service('playlistService', ['$rootScope', function($rootScope) {
    var self = this;
    self.playlist = [];
    

   

    self.addTrack = function (track) {

        console.log("service add Track");
        console.log(track);
        var playlist = self.getPlaylist();
        playlist.push(track);
        self.SaveTrack(playlist);
          
    },

    self.SaveTrack = function(param) {
        localStorage.playlistService = angular.toJson(param);
    },

    self.RestoreState = function () {
        self.playList = angular.fromJson(localStorage.playlistService);
        return self.playList;
    },


    self.removeTrack = function (trackId) {
        console.log("fct remove service" );
        console.log(trackId);
        self.trackExist = false;
        self.playlist = self.RestoreState();   
        var index = self.playList.indexOf(trackId);
        self.playList.splice(index, 1);     
        self.SaveTrack(self.playList);
    },

    self.getPlaylist = function () {
       console.log("fct get playlist");
       return self.playlist;
    },

    self.checkExistTrack = function(trackId){
        console.log("check exist track");
        console.log("trackId envoyé");
        console.log(trackId.id);
        //console.log(self.playlist);
        var playlist = self.getPlaylist();
        for( var j=0; j < playlist.length; j++){
            console.log("rentre ds le for");
            if(playlist[j].id == trackId){
                console.log("la track existe");
                return true;
            }else{
                console.log("la la track n'existe pas");
                return false;
            }
        };
        return false;
    },
    self.playlist = self.RestoreState();

    
    console.log(self.playlist);

}]);


app.controller('controllerPrincipal', ['$rootScope','$scope','$http', 'playlistService',  function($rootScope,$scope,$http, playlistService){

    

    console.log($rootScope.favoriteList);


}]);

app.controller('searchController', ['$rootScope','$scope','$http', 'playlistService', function($rootScope, $scope, $http, playlistService) {
    var search = this;
    //$('select').formSelect();
   
    /* https://api.deezer.com/search?q=artist:"aloe blacc" track:"i need a dollar" */
    /* hhttps://api.deezer.com/search/album?q=eminem */
    /* https://api.deezer.com/search?q=album:"good things" */
    /*	https://api.deezer.com/search?q=track:"i need a dollar"  */
   

    //Properties
    search.musicList = [];
    search.index = 0;
    search.endList = false;


    $scope.filter = '';
    $scope.text= '';
    $scope.hideResult1 = true;
    $scope.hideResult2 = true;

    console.log($rootScope.favorite);

    var convertTime = function(duration){
        console.log("test type de duration "+typeof duration);
        var minutes = Math.trunc(duration/60);
        var secondes = duration % 60;

        if(secondes < 10){
            secondes = '0'+secondes;
        }

        var result = minutes+'m '+secondes;
        
        return result;
    }


    search.requestToApi = function(request){

        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
         
            $scope.data = response.data;
            
          


            console.log("$scope.data :");
            console.log($scope.data);

            angular.forEach( $scope.data.data.data, function(value, key){
                console.log(value.duration);
                v
                $scope.data.data.push(value.duration);
            });
            console.log($scope.data);
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
           
          
        }else{
            
            var request2 = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q='+$scope.text+$scope.filter;
            console.log("resquest2: "+request2);

            var temp2 =  search.requestToApi(request2);

            $scope.hideResult1 = false;
            
            console.log(temp2);
        }

    };
    
}]);


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
                
                $scope.tracks = response.data.tracks.data;
                console.log(response.data.tracks.data);
                $scope.dataTracks = [];

                angular.forEach( response.data.tracks.data, function(value, key){
                    console.log(value.title);
                    $scope.dataTracks.push(value);
                });
                console.log($scope.dataTracks)

        }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
        
    };

    var temp = this.requestToApi(request);
});


app.controller('trackController', ['$scope','$http','playlistService', function($scope,$http,playlistService) {
    console.log("track Controller");
    console.log($scope.id);
    var track = this;

    track.requestToApi = function(request){
        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                console.log(response.data);
                $scope.data = response.data;

                $scope.titleTrack = response.data.title; 
                $scope.titleAlbum = response.data.album.title;
                $scope.albumId = response.data.album.id;

                $scope.date = response.data.release_date

                $scope.cover = response.data.album.cover_medium;

                $scope.duration = convertTime(response.data.duration);
                $scope.date = response.data.release_date;
                $scope.preview = response.data.preview;
                $scope.artiste_name = response.data.artist.name;
                $scope.artistId = response.data.artist.id;
                $scope.artistImg = response.data.artist.picture_medium;

        
                var element = angular.element(document.querySelector('#track'));
                element.append('<audio controls="controls"> <source src='+$scope.preview+' /></audio>');


                $scope.maTrack.id = response.data.id;
                $scope.maTrack.src = response.data.preview;   
                $scope.maTrack.cover = response.data.album.cover_small;
            
                $scope.maTrack.title = response.data.title_short;
                $scope.maTrack.artist = response.data.artist.name;
                $scope.maTrack.album = response.data.album.title;
                $scope.maTrack.link = response.data.link;

                console.log($scope.maTrack);

                for (var i = 0; i <= localPlaylist.length; i++){  
                    console.log("local playlist après request");
                 
                    if( localPlaylist[0].id == $scope.maTrack.id ){
                        $scope.trackExist = true;
                        console.log($scope.trackExist);
                    }else{
                        $scope.trackExist = false;
                        console.log($scope.trackExist);
                    }  
                }
                console.log($scope.trackExist);
               
                
        }, function errorCallback(response) {
                console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
    };

    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"+$scope.id;

    var temp =  track.requestToApi(request);



    $scope.$watch('$viewContentLoaded','playlistService','track', function(){
        
        console.log("la page est chargé");


        $scope.watchTrackExist ="test";
        console.log("watch "+$scope.watchTrackExist);
        console.log("au chargement track: "+$scope.maTrack);
        console.log($scope.maTrack);
        //$scope.trackExist = playlistService.checkExistTrack($scope.maTrack);

       
        $scope.istrackExist = playlistService.checkExistTrack($scope.maTrack);
        $scope.trackExist = "oui";

        console.log($scope.trackExist);

       track.addToPlaylist = function () {
            
            console.log("fonction add toPlaylist");
            console.log($scope.maTrack);
            $scope.trackExist = true;
            console.log($scope.trackExist);
            playlistService.addTrack($scope.maTrack); 
        };

        var convertTime = function(duration){
            
                    var minutes = Math.trunc(duration/60);
                    var secondes = duration % 60;
            
                    if(secondes < 10){
                        secondes = '0'+secondes;
                    }
            
                    var result = minutes+'m '+secondes;
                    
                    return result;
                }
            
               
            
                
            
                $scope.removeToPlaylist = function () {
                    
                    console.log("fction removeToPlaylist");
                    console.log($scope.maTrack);
                    $scope.trackExist = false;
                    playlistService.removeTrack($scope.maTrack.id);
                };
            
            
            
               
            
                $scope.maTrack = {
                    id:'',
                    src:'',
                    cover:'',
                    title: '',
                    artist:'',
                    album:'',
                    link:''
                };
            
               
            
                var localPlaylist = playlistService.getPlaylist();
            
                
                for (var i = 0; i < localPlaylist.length; i++){  
                   console.log($scope.id);
                    if(localPlaylist[i].id === $scope.id){
                        console.log("oui");
                        $scope.trackExist = true;
                    }else{
                        console.log("non");
                        $scope.trackExist = false;
                    }  
                    
                };
            
            
                //console.log($scope.maTrack);
                /* https://api.deezer.com/album/27 */
            
            
            
            
                console.log(temp);


    });
    
    
    



}]);


app.controller('favorisController', ['$scope','$http','playlistService','$window','$document', function($scope,$http,playlistService,$window,$document) {
    console.log("ctrl favoris");
    var favoris = this;
    $scope.audio = new Audio;
    console.log($scope.audio);
    this.removeFavoris = function($events, favorisId){
        console.log($events);
       var el = $events.toElement.parentElement.parentElement;

       console.log(el, favorisId);
       playlistService.removeTrack(favorisId);
       el.remove();
    }

    this.playTrack = function($events, trackId, trackIsPlayed){
        console.log("Joue la fct playTrack", trackId);
     
        console.log(trackIsPlayed);
        $scope.trackIsPlayed == true;
        var localplaylist = playlistService.getPlaylist();
        console.log(localplaylist);
        for( var i = 0; i < localplaylist.length; i++){
            if(localplaylist[i].id === trackId){
                console.log("a trouvé la track");
                console.log(localplaylist[i]);
                $scope.audio.setAttribute("src",localplaylist[i].src);
                $scope.audio.play();
                /*
                //var audio = new Audio(localplaylist[i].src);
                if(trackIsPlayed == false){
                    audio.play();
                    //$scope.trackIsPlayed == true;
                }else{
                    audio.stop();
                    //$scope.trackIsPlayed == false;
                }
                */
            }else{
                console.log("pas de track");
            }
        }
        trackIsPlayed = true
    };

    this.pauseTrack = function() {
        $scope.audio.pause();
    }
    
    $scope.mesfavoris = playlistService.getPlaylist();

    //console.log($scope.favoris);
}]);