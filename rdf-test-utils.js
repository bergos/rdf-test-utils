var assert = require('assert');
var fs = require('fs');
var jsonld = require('jsonld');
var Promise = require('es6-promise').Promise;


var Utils = function(rdf) {
	var u = {};

	u.compareGraph = function(a, b, callback) {
		if(a == null) a = rdf.createGraph();
		if(b == null) b = rdf.createGraph();
	
		rdf.serializeJsonLd(a, function(aJsonLd) {
			jsonld.normalize(aJsonLd, {format: 'application/nquads'}, function(error, aNormalized) {
				rdf.serializeJsonLd(b, function(bJsonLd) {
					jsonld.normalize(bJsonLd, {format: 'application/nquads'}, function(error, bNormalized) {
						callback(aNormalized == bNormalized, aNormalized, bNormalized);
					});
				});
			});
		});
	};

	u.p = {};

	u.p.parseTurtle = function(s, b) {
		return new Promise(function(resolve, reject) {
			rdf.parseTurtle(s, function(g) {
				if(g == null)
					reject();
				else
					resolve(g);
			}, b);
		});
	};

	u.p.parseJsonLd = function(s, b) {
		return new Promise(function(resolve, reject) {
			rdf.parseJsonLd(s, function(g) {
				if(g == null)
					reject();
				else
					resolve(g);
			}, b);
		});
	};
	
	u.p.request = function(r) {
		return new Promise(function(resolve, reject) {
			r.end(function(err, res) {
				if(err != null)
					reject(err);
				else
					resolve(res);
			});
		});
	};
	
	u.p.assertStatusSuccess = function(res) {
		return new Promise(function(resolve, reject) {
			var success = (res.status >= 200 && res.status < 300);

			assert.ok(success, 'status code != 2xx');

			if(!success)
				reject(res);
			else
				resolve(res);
		});
	};
	
	u.p.assertGraphEqual = function(a, b, m) {
		return new Promise(function(resolve, reject) {
			u.compareGraph(a, b, function(equals, aNorm, bNorm) {
				assert.equal(aNorm, bNorm, m != null ? m : 'graph a != b');
	
				if(!equals)
					reject();
				else
					resolve();
			});
		});
	};
	
	u.p.assertGraphEmpty = function(a) {
		return u.p.assertGraphEqual(a, rdf.createGraph(), 'graph not empty');
	};

	u.p.wait = function(t) {
	 	return new Promise(function(resolve, reject) {
	 		setTimeout(resolve, t);
	 	});
	};

	return u;
};


module.exports = Utils;