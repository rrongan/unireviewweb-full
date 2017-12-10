//
// Copyright (c) 2017 by Fedir Bobylev. All Rights Reserved.
// https://github.com/Techblogogy/free-google-image-search
//
var app = angular.module('UniReviewWeb');

app.factory('GoogleImageSearch', function (){

	/**
	 * Function for image search
	 *
	 * @param  {string} query   Image search filed query
	 * @return {Promise}        Returns a promise, with an array of found image URL's
	 */
	this.searchImage = function(query) {
		query = encodeURIComponent(query);

		return new Promise( (resolve, reject) => {

			// Fetches Items from Google Image Search URL
			fetch('https://cors-anywhere.herokuapp.com/https://www.google.com.ua/search?source=lnms&sa=X&gbv=1&tbm=isch&q='+query)
				.then( res => res.text() )
				.then( res => {

					// Transforms HTML string into DOM object
					let parser = new DOMParser();
					parser = parser.parseFromString(res, 'text/html');

					// Gets DOM element with image results
					let images = parser.getElementById('ires').childNodes[0];

					if (images.nodeName === 'DIV') {

						resolve(this.googleGetMobile(images));
					} else if (images.nodeName === 'TABLE') {

						resolve(this.googleGetDesktop(images));
					} else {

						reject('Unknown System');
					}

				})
				.catch( err => reject(err) );
		});
	};

	/**
	 * Traverses DOM tree in mobile layout
	 *
	 * @param  {NodeList} images    Children of "ires" container
	 * @return {Array}              Array of found images URL's
	 */
	this.googleGetMobile = function(images) {

		// Transforms DOM NodeList of images into Array.
		// Needed to use .map method
		images = Array.from(images.childNodes);

		// Maps Image Sources
		return images.map( (imgDiv) => {
			console.log(imgDiv.getAttribute('href'));
			return imgDiv.childNodes[0].src;
		} );
	};

	/**
	 * Traverses DOM tree in desktop layout
	 *
	 * @param  {NodeList} images    Children of "ires" container
	 * @return {Array}              Array of found images URLs
	 */
	this.googleGetDesktop = function(images) {

		// NodeList of table rows
		images = images.childNodes[0].childNodes;

		// Empty List of image URLs
		let imgSrc = [];

		// Traverses table node for images
		images.forEach( (tRow) => {
			tRow = tRow.childNodes;
			tRow.forEach( (tCol) => {
				let aLink = tCol.childNodes[0].childNodes[0];
				imgSrc.push(aLink.src);
			});
		} );

		return imgSrc;
	};

	return this;
});