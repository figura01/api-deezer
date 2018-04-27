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

app.service('playlistService', ['$rootScope','$window', function($rootScope,$window) {
    var self = this;
    $rootScope.playlist = [];
    
    //console.log("service playlist", self.playlist);
   

    self.addTrack = function (track) {

        //console.log("service add Track");
        //console.log("la track envoyé au service",track);
        var playlist = $rootScope.playlist;
        //console.log("test le tableau",playlist);
     
        playlist.push(track);
        self.SaveTrack(playlist);
       
          
    },

    self.removeTrack = function (trackId) {
        //console.log("fct remove service" );
        //console.log(trackId);
        //$window.localStorage.removeItem(key)
        self.playlist = self.RestoreState(); 
        //console.log(self.playlist);
        
        var index = self.playList.indexOf(trackId);
        self.playList.splice(index, 1);     
        self.SaveTrack(self.playList);
        
    },

    self.SaveTrack = function(param) {
        //console.log('fction save track', param);
        localStorage.playlistService = angular.toJson(param);
        //$window.localStorage.setItem(param,localStorage.playlistService);
        //console.log(localStorage.playlistService);
    },

    self.RestoreState = function () {
        self.playList = angular.fromJson(localStorage.playlistService);
        return self.playList;
    },


    

    self.getPlaylist = function () {
       //console.log("fct get playlist");
       self.playlist = self.RestoreState();
       //console.log(self.playlist);  
       return self.playlist;
    },

    self.checkExistTrack = function(trackId){
        //console.log("check exist track");
        //console.log("trackId envoyé");
        //console.log(trackId.id);
        //console.log(self.playlist);
        var playlist = self.getPlaylist();

        if(angular.isUndefined(playlist) ) {
            //console.log("La playlist est vide");
            return false;
        }else{
            //console.log("La playlist n'est pas vide");
            return true;
        }
        return false;
    }
    
    //console.log(self.playlist);

}]);


app.controller('controllerPrincipal', ['$rootScope','$scope','$http', 'playlistService',  function($rootScope,$scope,$http, playlistService){

    //console.log($rootScope.favoriteList);
}]);

app.controller('searchController', ['$rootScope','$scope','$http', 'playlistService', function($rootScope, $scope, $http, playlistService) {
    var search = this;
   
    //Properties
    $scope.page_title = "Faites vos recherches et retrouvez vos titres favoris";
    $scope.filter = '';
    $scope.text= '';
    $scope.hideResult = true;
    $scope.loader = $("#loader");
    $scope.loader.hide();


    var link_recherche = $("#link-recherche");
    var link_favoris = $("#link-favoris");

    if( link_favoris.hasClass('active') ){
        link_recherche.addClass('active');
        link_favoris.removeClass('active');
    }else{
        link_recherche.addClass('active');
    }

    //Je recupere la playliste
    $rootScope.playlist = playlistService.getPlaylist();

    var convertTime = function(duration){
        //console.log("test type de duration "+typeof duration);
        var minutes = Math.trunc(duration/60);
        var secondes = duration % 60;

        if(secondes < 10){
            secondes = '0'+secondes;
        }

        var result = minutes+'m '+secondes;
        
        return result;
    }

    search.addToPlaylist = function(data){
        //console.log("addToPlaylist function",data);

        $scope.data.data[data.index].isTrackInPlaylist = true;
        //console.log(data);

 
        playlistService.addTrack(data); 
    }

    search.removeToPlaylist = function (data) {
                
        //console.log("fction removeToPlaylist");
        //console.log(data.id);
        $scope.data.data[data.index].isTrackInPlaylist = false;
        playlistService.removeTrack($scope.data.id);
    }; 

    search.requestToApi = function(request){

        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
            
            //Stoke le resulats de request dans data
            $scope.data = response.data;
            $scope.loader.hide();
            //Je parours l ensemble du tableau d objet retourner par la request

            
            angular.forEach( $scope.data.data, function(value, key){
               
                //Pour chaque enregistement je convertis la valeur de duration
                value.duration = convertTime(value.duration);
                value.index = key;

                //Pour chaque enregistrement j'ajoute la propriété isTrackInPlaylist et l initialise a false;
                if(angular.isUndefined($scope.data.data[key].isTrackInPlaylist)){
                    $scope.data.data[key].isTrackInPlaylist = false;
                }
                //console.log("$rootScope.playlist",$rootScope.playlist);
                //Je parcours la playlist
                if($rootScope.playlist[0] == null){
                    //console.log("$rootScope.playlist null");
                    $scope.data.data[key].isTrackInPlaylist = false;
                }else{
                    //console.log("$rootScope.playlist not null")
                    for(var i =0; i<$rootScope.playlist.length; i++){

                        //Je test si Id de la piste existe dans la playlist
                        if($rootScope.playlist[i].id == $scope.data.data[key].id){
                            //Si oui, alors alors sa propriété isTrackInPlaylist pass à true
                            $scope.data.data[key].isTrackInPlaylist = true;
                        }
                    }
                }
                
               
            });
        }, function errorCallback(response) {
            //console.log(response);
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    search.onSearch = function(search){

        //console.log("envoie formulaire");
        
        //Recupere le parametre de filtrage
        $scope.filter = search.filter;
        $scope.loader.show();
        //Recupere le text tapper par l'utilisateur
        $scope.text = search.text;

        //Je test lors de l envoie du fomulaire si le parametre de filtre existe
        if( angular.isUndefined($scope.filter) ){
            //Si il n y pas de fitre alors je concatène ma request avec le champ text
            var request = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q='+$scope.text;
            //console.log("request: "+request);

            var temp = search.requestToApi(request);

            //Je demasque la zone d'affiche des resultat
            $scope.hideResult = false;
           
          
        }else{
            //Sinon je concatène ma request avec le paramètre de text et le paramètre issu de danps filtre
            var request2 = 'https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q='+$scope.text+$scope.filter;
            //console.log("resquest2: "+request2);

            //J envoie ma request à l api
            var temp2 = search.requestToApi(request2);

            //Je démasque la zone de résultat
            $scope.hideResult = false;
        }

    };
    
}]);


app.controller('artistController', function($scope,$http) {
    //console.log("artist controller");
    //console.log($scope.id);

    var artist = this;
    this.id = $scope.id;
    $scope.page_title = "Fiche de l'artiste";

    /* https://api.deezer.com/artist/27 */

    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/artist/"+this.id;
    //console.log(request);


    artist.requestToApi = function(request){
        
        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //console.log(response.data);
                $scope.datas = response.data; 
        }, function errorCallback(response) {
                //console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
        
    };

    var temp =  artist.requestToApi(request);
    //console.log(temp);

});

app.controller('albumController', function($scope,$http) {
    //console.log("album Controller");
    //console.log($scope.id);
    /* https://api.deezer.com/album/27 */
    var album = this;
    this.id = $scope.id;
    $scope.page_title = "Fiche de l'album";
    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/"+this.id;

    this.requestToApi = function(request){
        
        $http({
            method: 'GET',
            url: request
        }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                //console.log(response.data);
                $scope.datas = response.data;
                
                $scope.tracks = response.data.tracks.data;
                //console.log(response.data.tracks.data);
                $scope.dataTracks = [];

                angular.forEach( response.data.tracks.data, function(value, key){
                    //console.log(value.title);
                    $scope.dataTracks.push(value);
                });
                //console.log($scope.dataTracks)

        }, function errorCallback(response) {
                //console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
        
    };

    var temp = this.requestToApi(request);
});


app.controller('trackController', ['$scope','$http','playlistService', function($scope,$http,playlistService) {
    //console.log("track Controller");
    //console.log($scope.id);
    var track = this;
    $scope.page_title = "Fiche de la piste";
    $scope.isTrackExist;
    $scope.maTrack = {
        id: '',
        src: '',
        cover: '',
        title: '',
        artist: '',
        album: '',
        link: '',
    };

    var trackExist = playlistService.checkExistTrack($scope.id);
    //console.log("trackExist", trackExist );
    var localPlaylist = playlistService.getPlaylist();

  

    var convertTime = function(duration){
            
        var minutes = Math.trunc(duration/60);
        var secondes = duration % 60;

        if(secondes < 10){
            secondes = '0'+secondes;
        }

        var result = minutes+'m '+secondes;
        
        return result;
    };
    
    track.addToPlaylist = function (maTrack) {
        //console.log("fonction add toPlaylist");
        //console.log(maTrack);

        $scope.isTrackExist = true;
        playlistService.addTrack($scope.data); 

    };


    track.removeToPlaylist = function (maTrack) {
                
        //console.log("fction removeToPlaylist");
        //console.log($scope.maTrack.id);
        $scope.isTrackExist = false;
        playlistService.removeTrack($scope.maTrack.id);
    }; 

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

        
                var element = angular.element(document.querySelector('#playerTrack'));
                element.append('<audio controls="controls"> <source src='+$scope.preview+' /></audio>');

                //Creation de l objet ma track
                $scope.maTrack.id = response.data.id;
                $scope.maTrack.src = response.data.preview;   
                $scope.maTrack.cover = response.data.album.cover_small;
            
                $scope.maTrack.title = response.data.title_short;
                $scope.maTrack.artist = response.data.artist.name;
                $scope.maTrack.album = response.data.album.title;
                $scope.maTrack.link = response.data.link;

                //console.log("Ma track apres request",$scope.maTrack)
                
        }, function errorCallback(response) {
                //console.log(response);
                // called asynchronously if an error occurs
                // or server returns response with an error status.
        });
    };

 

    

    var request = "https://cors-anywhere.herokuapp.com/https://api.deezer.com/track/"+$scope.id;

    var temp =  track.requestToApi(request);
            
    //console.log(temp);

    $scope.$watch('$viewContentLoaded', function(){
        //console.log("chargement de la page");
        //console.log($scope.id);

        var temp = playlistService.getPlaylist();
        //console.log("temp ",temp);

        if(!angular.isUndefined(temp)){
            for( var j = 0; j < temp.length; j++){
                if(temp[j].id == $scope.id ){
                    //console.log("la track existe ds la playlist");
                    $scope.isTrackExist = true;
                }else{
                    //console.log("la track n existe pas ds la playlist");
                    $scope.isTrackExist = false;
                }

            } 

            //console.log("parcours la playlist");
        }
    });


}]);


app.controller('favorisController', ['$rootScope','$scope','$http','playlistService','$window','$document', function($rootScope,$scope,$http,playlistService,$window,$document) {
    //console.log("ctrl favoris");
    var favoris = this;

    var link_recherche = $("#link-recherche");
    var link_favoris = $("#link-favoris");

    if( link_recherche.hasClass('active') ){
        link_recherche.removeClass('active');
        link_favoris.addClass('active');
    }else{
        link_favoris.addClass('active'); 
    }
   
    $scope.page_title = "Mes Favoris"
    $scope.audio = new Audio;
    //console.log($scope.audio);
    favoris.trackIsPlayed = false;
    $scope.mesfavoris = playlistService.RestoreState();
    //console.log("rootScope ",$rootScope.playlist);

    //$scope.mesfavoris = $rootScope.playlist;
    //console.log("playlist", $rootScope.playlist);
    var btns_pause = $('.btn-pause');
    btns_pause.css({'display' :' none'});

    this.removeFavoris = function($events, favorisId){
        //console.log($events);
        var el = $events.toElement.parentElement.parentElement.parentElement;

        //console.log(el, favorisId);
        playlistService.removeTrack(favorisId);
        el.remove();
    }

    this.playTrack = function($events, trackId, trackIsPlayed,$index){
        //console.log("Joue la fct playTrack", trackId);
     
        //console.log(trackIsPlayed);
        //console.log("index ",$index);
        //favoris.trackIsPlayed = true;
        $(".btn-pause").hide();
        $(".btn-play").show();
        var btn_play = $('#btn-play'+$index);
        btn_play.hide();

        var btn_pause = $('#btn-pause'+$index);
     
        btn_pause.show();
        //console.log();
        var localplaylist = playlistService.getPlaylist();
        //console.log(localplaylist);
        for( var i = 0; i < localplaylist.length; i++){
            if(localplaylist[i].id === trackId){
                //console.log("a trouvé la track");
                //console.log(localplaylist[i]);
                $scope.audio.setAttribute("src",localplaylist[i].preview);
                $scope.audio.play();
               
            }else{
                //console.log("pas de track");
            }
        }
        trackIsPlayed = true
    };

    this.pauseTrack = function($events, trackId, trackIsPlayed,$index) {

        var btn_play = $('#btn-play'+$index);
        btn_play.show();

        var btn_pause = $('#btn-pause'+$index);
        btn_pause.hide();

        $scope.audio.pause();
    }
    
    $scope.mesfavoris = playlistService.getPlaylist();


    $scope.$watch('$viewContentLoaded', function(){

        angular.forEach($scope.mesfavoris, function(value, key) {
            //console.log("foreach");
            //console.log(value, key );
            var $current_btn_pause = $('#btn-pause0');
        
            $current_btn_pause.hide();
            $current_btn_pause.hidden = true;
            //console.log($current_btn_pause);
    
        });
    });

    //console.log("scope mes favoris",$scope.mesfavoris);

}]);