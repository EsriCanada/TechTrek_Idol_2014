define([
		'dojo/_base/declare',
		'dojo/_base/lang',
		'dojo/_base/array',
		'esri/geometry/Point',
		'esri/geometry/mathUtils',
		'dojox/lang/functional/object'
	],
	function(declare, lang, array, Point, mathUtils, obj) {
		return declare([], {
		
			status: "READY",
			range: 100, // default, to be set by calling code
			chargingStationLayer: null,
			
			analyze:function( directions ) {
				//console.debug(directions);
		
				/*
					We know how long the polyline paths are: they are in the JSON.
					But we are measuring segments in Web Mercator: unreliable.
					Let's measure the line in WM to find out how unreliable our ruler is.
				*/
				var distortionFactor = this.calculateDistortionFactor(directions);
		
				/*
					Here is where we store the information about our closest brushes with stations
					Store by ChargingStation
				*/
				var brushes = {};
								
				// Track the stops we add
				var additionalStops = [];
				
				// Step through features until the accumulated length reaches 80% of range
				var legLength = 0;
				var stopCount = 0;
				var lastChargingStationID = null;
				var distanceTravelled = 0;

				for (var feature = 0; feature < directions.features.length; feature++) {
					var item = directions.features[feature]
					
					var polyline = item.geometry;
					if (item.attributes.maneuverType == "esriDMTStop") {
						stopCount++;
					}
					for (var path = 0; path < polyline.paths.length; path++) {
						for (var pt = 0; pt < polyline.paths[path].length - 1; pt++) {
							var point1 = new Point(polyline.paths[path][pt], polyline.spatialReference);
							var point2 = new Point(polyline.paths[path][pt+1], polyline.spatialReference);
							var l = mathUtils.getLength(point1, point2) / distortionFactor;
							legLength += l / 1000; // Translate m into km
							distanceTravelled += l / 1000;
							
							var rangeRemaining = this.range - legLength;
							
							// Check to see if we can make it the rest of the way on this charge
							if (directions.summary.totalLength < (distanceTravelled + rangeRemaining)) {
								console.log("Can make it the rest of the way.");
								pt = polyline.paths[path].length;
								path = polyline.paths.length;
								feature = directions.features.length;
								break;
							}
						
							// Find the closest charging station
							//console.log("Find a charging station after f:" + feature + ", p:" + path + ", pt:" + pt + " (" + legLength + ") km");
							var findResult = this.findChargingStationNearestTo(point2, rangeRemaining, distortionFactor)
								
							if ( findResult != null ) {
								// Mark where we are in the looping
								findResult.feature = feature;
								findResult.path = path;
								findResult.pt = pt;
								findResult.legDistance = legLength;
								
								// Have we brushed this station before?
								var previousResult = brushes[findResult.csID];
								if (previousResult == null) {
									brushes[findResult.csID] = findResult;
								}
								else if (findResult.distance < previousResult.distance) {
									brushes[findResult.csID] = findResult;
								}
							}
							else {
								// No station in range, backtrack
								// Go into the brushes and find the "best" station we passed
								//console.log("Travelled " + legLength + " km of " + this.range + " km range");
								//console.debug(brushes);
								//console.debug(point2);
								var bestResult = this.getBestStationToBackTrackTo(brushes, legLength);
								var fail = false;
								if (bestResult == null && lastChargingStationID == null) {
									// We never found a station
									fail = true;
								}
								else {
									if (lastChargingStationID == bestResult.csID) {
										// We are backtracking to the station we left
										fail = true;
									}
									else {
										// Backtrack to the best station and make it a stop
							
										// Add after the most recent stop and previous charging stations
										//console.log("Added stop");
										//console.debug(bestResult.point);
										additionalStops.push({
											point: bestResult.point,
											index: 1 + stopCount + additionalStops.length
										});
										
										// Since we've backtracked, remove from distanceTravelled
										distanceTravelled -= (legLength - bestResult.legDistance);
										
										// Reset all the looping etc. to begin moving forward again.
										legLength = 0;
										brushes = {};
										lastChargingStationID = bestResult.csID;
										feature = bestResult.feature;
										path = bestResult.path;
										pt = bestResult.pt;
										
									}
								}
								
								if (fail) {
									this.status = "ERROR";
									return [];
								}
							}
						}
					}
				}
		
				// Did we add any stops?
				if (additionalStops.length > 0) {
					// Re-run the route
					console.log("Re-running directions, because we added " + additionalStops.length + " stops");
					this.status = "RERUNNING";
				}
				else {
					console.log("No need to add any stops.");
					this.status = "READY";
				}
				return additionalStops;
			},
			
			trimRoute: function(directions) {
				//console.debug( directions );
				
				/*
					Due to the vagaries of data, it is possible that too many stops
					were added. Look for two legs back to back which add up to < this.range
					and remove the stop in between.
				*/
				
				var removedStops = [];
				
				var legs = [];
				var legLength = 0;
				
				for (var feature = 0; feature < directions.features.length; feature++) {
					var item = directions.features[feature]
					var polyline = item.geometry;
					if (item.attributes.maneuverType == "esriDMTStop") {
						legs.push( legLength );
						legLength = 0;
					}
					else {
						legLength += item.attributes.length;
					}
				}
				
				// Start at 1, check legIndex and legIndex-1
				//console.debug(legs);
				for (var legIndex = 1; legIndex < legs.length; legIndex++ ) {
					var twoLegDistance = legs[legIndex-1] + legs[legIndex];
					if (twoLegDistance < this.range) {
						// Take out the stop at legIndex
						//console.log( "Legs " + (legIndex-1) + " and " + legIndex + " add up to " + twoLegDistance + " km" );
						removedStops.push(legIndex);
						legs[legIndex] = twoLegDistance;
					}
				}
				
				// Did we remove any stops?
				if (removedStops.length > 0) {
					// Re-run the route
					console.log("Re-running directions, because we are removing " + removedStops.length + " stops");
					this.status = "RERUNNING";
				}
				else {
					console.log("No need to remove any stops.");
					this.status = "READY";
				}
				return removedStops;
			},
			
			calculateDistortionFactor: function(directions) {
				var wmLength = this.measureDirectionsLength(directions);
				var realLength = directions.totalLength;
				//console.log("Measured length to be " + wmLength + ", real length is " + realLength);
				var factor = wmLength / realLength;
				//console.log("Applying distortion factor of " + factor);
				return factor;
			},
			
			measureDirectionsLength: function(directions) {
				var directionsLength = 0;
				array.forEach( directions.features, lang.hitch(this, function(item, idx) {
					var polyline = item.geometry;
					for (var path = 0; path < polyline.paths.length; path++) {
						for (var pt = 0; pt < polyline.paths[path].length - 1; pt++) {
							var point1 = new Point(polyline.paths[path][pt], polyline.spatialReference);
							var point2 = new Point(polyline.paths[path][pt+1], polyline.spatialReference);
							var l = mathUtils.getLength(point1, point2);
							directionsLength += l / 1000; // Translate m into km
						}
					}
				}));
				return directionsLength;
			},
			
			findChargingStationNearestTo:function(point, rangeRemaining, distortionFactor) {
				var distance = Number.MAX_VALUE;
				var closestStation = null;
				
				rangeRemaining *= 1000; // Translate to metres
				
				if (this.chargingStationLayer == null) {
					console.error("Null charging station layer");
				}
				if (this.chargingStationLayer.graphics == null) {
					console.error("Null charging station layer graphics");
				}
				if (this.chargingStationLayer.graphics.length == 0) {
					console.error("Zero charging station layer graphics");
				}
				
				// Loop through features to find the closest
				//var count = 0;
				array.forEach(this.chargingStationLayer.graphics, lang.hitch(this, function(item) {
					//count++;
					try {
						var distanceToFeature = mathUtils.getLength(point, item.geometry) / distortionFactor;
						if (distanceToFeature < distance) {
							closestStation = item;
							distance = distanceToFeature;
						}
					} catch (err) {
						//console.error("Error caught finding distance to charging station");
						//console.debug(err);
						//console.debug(item);
					}
				}));
				//console.log("Analyzed " + count + " charging stations.");				
				
				//console.debug(closestStation);
				if (distance > rangeRemaining) {
					//console.log( "The closest station was farther than the remaining range of " + (rangeRemaining / 1000) );
					return null;
				}
				return {
					point: closestStation.geometry,
					csID: closestStation.attributes.UUID,
					distance: distance / 1000 // translate back into km
				};
			},
			
			getBestStationToBackTrackTo: function(findResults, distanceSinceLastStop) {
				//console.log("Finding the best station we have passed.");
				//console.debug( findResults );
				
				var bestResult = null;
				var bestScore = Number.MAX_VALUE;
				
				array.forEach(obj.values(findResults), lang.hitch( this, function(result) {
					var score = result.distance + (distanceSinceLastStop - result.legDistance);
					if (score < bestScore) {
						bestScore = score;
						bestResult = result;
					}
				}));
				
				return bestResult;
			}
		});
	});