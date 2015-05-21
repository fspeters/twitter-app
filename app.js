angular
	.module('app', ['ngRoute','app.services'])
	.config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'views/home.html',
			})
			.when('/search', {
				templateUrl : 'views/search.html',
				controller 	: 'searchController'
			})
			.when('/trending', {
				templateUrl : 'views/trends.html',
				controller 	: 'trendsController'
			})
			.when('/profiles/:screenName', {
				templateUrl	: 'views/profile.html',
				controller  : 'profileController'
			})
			.otherwise({
				redirectTo : '/'
			});
	})

	.controller('searchController', ['$scope', '$q', 'twitterService', function($scope, $q, twitterService) {
		$scope.search = function() {
			var searchTerm = encodeURIComponent($scope.searchTerm);
			twitterService.getSearchResults(searchTerm).then(function(data) {
				$scope.tweets = data;
			});
		};

		if (twitterService.isReady()) {
			$scope.search();
		}
	}])

	.controller('trendsController', ['$scope', '$q', 'twitterService', function($scope, $q, twitterService) {
		$scope.trending = function() {
			twitterService.getTrends().then(function(data) {
				$scope.trends = data[0].trends;
			});
		};

		if(twitterService.isReady()) {
			$scope.trending();
		}
	}])

	.controller('profileController', ['$scope', '$q', 'twitterService', '$routeParams', function($scope, $q, twitterService, $routeParams) {
		$scope.profile = function() {
			twitterService.getProfileDetails($routeParams.screenName).then(function(data) {
				$scope.profileDetails = data;
			});
		};

		if(twitterService.isReady()) {
			$scope.profile();
		}
	}])

	.controller('headerController', ['$scope','$location', function($scope, $location) {
		$scope.isActive = function(viewLocation) {
			return viewLocation === $location.path();
		};	
	}])

	.directive('twitter', function() {
		var template = 	'<button ng-click="connectButton()" id="connectButton" class="btn btn-primary" type="button">Connect Twitter</button>' +
						'<button ng-click="signOut()" id="signOut" class="btn btn-danger" type="button" style="display:none;">Sign Out</button>';
		return {
			restrict : "A",
			template : template,
			scope : {
				value: '=twitter'
			},
			controller : function($scope, twitterService) {
				twitterService.initialize();

				$scope.connectButton = function() {
					twitterService.connectTwitter().then(function() {
						$scope.test = twitterService.authenticated;
						$('#connectButton').fadeOut(function() {
							$('#signOut').fadeIn();
						});
					});
				};

				$scope.signOut = function() {
					twitterService.clearCache();
					$('#signOut').fadeOut(function() {
						$('#connectButton').fadeIn();
					});
				};

				if(twitterService.isReady()) {
					$('#connectButton').hide();
					$('#signOut').show();
				}
			}
		};
	});