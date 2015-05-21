/**
 * twitterService
 * @namespace Services
 */
angular
	.module('app.services', [])
	.factory('twitterService', ['$q', '$location', function($q, $location) {
		var authorizationResult = false;

		return {
			/**
			 * @name initialize
			 * @desc Initiates OAuth and creates a Twitter provider.
			 * @memberOf Services
			 */
			initialize : function() {
				OAuth.initialize('_iKX3qivV70o9OInp1nFFA2audc', { cache: true }),
				authorizationResult = OAuth.create('twitter');
			},

			/**
			 * @name isReady
			 * @desc Keeps track of the a user is still authenticated.
			 * @returns {Object}
			 * @memberOf Services
			 */
			isReady	: function() {
				return (authorizationResult);
			},

			/**
			 * @name connectTwitter
			 * @desc Connects the user with Twitter.
			 * @returns {Object}
			 * @memberOf Services 
			 */
			connectTwitter: function() {
				var deferred = $q.defer();

				OAuth.popup('twitter', { cache: true }, function(err, res) {
					if(!err) {
						authorizationResult = res;
						deferred.resolve();
					} else {
						throw new Error('Unexpected error');
					}
				});
				return deferred.promise;
			},
			
			/*
			 * @name clearCache
			 * @desc By clearing the cache the user is no longger authenticated.
			 * @memberOf Services
			 */
			clearCache	: function() {
				OAuth.clearCache('twitter');
				authorizationResult = false;
			},

			/**
			 * @name getSearchResults
			 * @desc Get the most recent results that match the input.
			 * @param {String} searchTerm
			 * @returns {Object}
			 * @memberOf Services
			 */
			getSearchResults : function(searchTerm) {
				var deferred = $q.defer(),
					promise	= authorizationResult.get('/1.1/search/tweets.json?q='+searchTerm+'&result_type=mixed').done(function(data) {
						deferred.resolve(data);
					});

				return deferred.promise;
			},

			/**
			 * @name getTrends
			 * @desc Get the top 10 trending keywords from the Netherlands.
			 * @returns {Object}
			 * @memberOf Services
			 */
			getTrends : function() {
				var deferred = $q.defer(),
					promise = authorizationResult.get('/1.1/trends/place.json?id=23424909').done(function(data) {
						deferred.resolve(data);
					});

				return deferred.promise;
			},

			/**
			 * @name getProfileDetails
			 * @desc Get the profile details from the requested user.
			 * @param {String} screenName
			 * @returns {Object}
			 * @memberOf Services
			 */
			getProfileDetails : function(screenName) {
				var deferred = $q.defer(),
					promise = authorizationResult.get('/1.1/users/show.json?screen_name=' + screenName).done(function(data) {
						deferred.resolve(data);
					});

				return deferred.promise;
			}
		}
	}]);