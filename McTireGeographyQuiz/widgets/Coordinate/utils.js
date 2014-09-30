define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/text!./wkid.json',
  'dojo/text!./transform.json'
], function(
  declare,
  lang,
  array,
  wkids,
  transforms
) {
  try {
    var spatialRefs = JSON.parse(wkids);
    var datumTrans = JSON.parse(transforms);
  } catch (err) {
    throw err;
  }

  var projectUnits = [
      "INCHES",
      "FOOT",
      "FOOT_US",
      "YARDS",
      "MILES",
      "NAUTICAL_MILES",
      "MILLIMETERS",
      "CENTIMETERS",
      "METER",
      "KILOMETERS",
      "DECIMETERS",
      "LINK_CLARKE",
      "Link_Clarke",
      "Foot_Gold_Coast",
      "Foot_Clarke",
      "Chain_Sears_1922_Truncated",
      "Yard_Indian",
      "Chain_Benoit_1895_B",
      "Yard_Sears",
      "Chain_Sears",
      "Foot_Sears",
      "Yard_Indian_1937",
      "50_Kilometers",
      "150_Kilometers"
    ],
    geographicUnits = ["DECIMAL_DEGREES", "DEGREE_MINUTE_SECONDS", "DEGREE", "GRAD"];

  var units = {
    // Meter
    "INCHES": 0.0254,
    "FOOT": 0.3048,
    "FOOT_US": 0.3048006096012192,
    "YARDS": 0.9144,
    "MILES": 1609.344,
    "NAUTICAL_MILES": 1852,
    "MILLIMETERS": 0.001,
    "CENTIMETERS": 0.01,
    "METER": 1,
    "KILOMETERS": 1000,
    "DECIMETERS": 0.1,
    "LINK_CLARKE": 0.2011661949,
    "FOOT_GOLD_COAST": 0.3047997101815088,
    "FOOT_CLARKE": 0.304797265,
    "CHAIN_SEARS_1922_TRUNCATED": 20.116756,
    "YARD_INDIAN": 0.9143985307444408,
    "CHAIN_BENOIT_1895_B": 20.11678249437587,
    "YARD_SEARS": 0.9143984146160287,
    "CHAIN_SEARS": 20.11676512155263,
    "FOOT_SEARS": 0.3047994715386762,
    "YARD_INDIAN_1937": 0.91439523,
    "50_KILOMETERS": 50000.0,
    "150_KILOMETERS": 150000.0,
    // radian
    "DEGREE": 0.0174532925199433,
    "DECIMAL_DEGREES": 0.0174532925199433,
    "DEGREE_MINUTE_SECONDS": 0.0174532925199433,
    "GRAD": 0.01570796326794897
  };

  var mo = declare(null, function() {
    // nothing
  });

  mo.getAllCSUnits = function() {
    var units = [];
    array.forEach(spatialRefs.wkids, lang.hitch(this, function(wkid) {
      var unit = this.getCSUnit(wkid);
      if (array.indexOf(units, unit) === -1) {
        units.push(unit);
      }
    }));
    return units;
  };

  // Unit
  mo.convertUnit = function(sUnit, tUnit, num) {
    return units[sUnit.toUpperCase()] / units[tUnit.toUpperCase()] * num;
  };

  mo.isProjectUnit = function(unit) {
    return array.indexOf(projectUnits, unit.toUpperCase()) > -1;
  };

  mo.isGeographicUnit = function(unit) {
    return array.indexOf(geographicUnits, unit.toUpperCase()) > -1;
  };

  mo.getGeographicUnits = function() {
    return geographicUnits;
  };

  mo.getProjectUnits = function() {
    return projectUnits;
  };

  mo.getCSUnit = function(wkid) {
    var csStr = this.getCSStr(wkid),
      sIdx = 0,
      eIdx = 0;
    sIdx = csStr.lastIndexOf("UNIT");
    eIdx = csStr.indexOf(',', sIdx);
    return csStr.slice(sIdx + 6, eIdx - 1);
  };

  // coordinate
  mo.isSameCoordinate = function(tWkid, sWkid) {
    var idx = this.indexOfWkid(tWkid),
      idx2 = this.indexOfWkid(sWkid);
    return spatialRefs.labels[idx] === spatialRefs.labels[idx2];
  };

  mo.isValidWkid = function(wkid) {
    return this.indexOfWkid(wkid) > -1;
  };

  mo.getCoordinateLabel = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var i = this.indexOfWkid(wkid);
      return spatialRefs.labels[i];
    }
  };

  mo.indexOfWkid = function(wkid) {
    return array.indexOf(spatialRefs.wkids, wkid);
  };

  mo.isValidTfWkid = function(tfWkid) {
    return this.indexOfTfWkid(tfWkid) > -1;
  };

  mo.getTransformationLabel = function(tfWkid) {
    if (this.isValidTfWkid(tfWkid)) {
      var i = this.indexOfTfWkid(tfWkid);
      return datumTrans.labels[i];
    }
    return "";
  };

  mo.indexOfTfWkid = function(tfWkid) {
    return array.indexOf(datumTrans.tfWkids, tfWkid);
  };

  mo.isGeographicCS = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var detail = spatialRefs.details[this.indexOfWkid(wkid)];
      return detail.startWith("GEOGCS");
    }

    return false;
  };

  mo.isProjectedCS = function(wkid) {
    if (this.isValidWkid(wkid)) {
      var detail = spatialRefs.details[this.indexOfWkid(wkid)];
      return detail.startWith("PROJCS");
    }

    return false;
  };

  mo.getGeoCSByProj = function(wkid){
    if (!this.isProjectedCS(wkid)){
      return;
    }
    var spheroidStr = this.getSpheroidStr(wkid);
    var idx = array.indexOf(spatialRefs.details, spheroidStr);
    return spatialRefs.wkids[idx];
  };

  mo.getSpheroidStr = function(wkid) {
    if (this.isGeographicCS(wkid)) {
      return spatialRefs.details[this.indexOfWkid(wkid)];
    } else if (this.isProjectedCS(wkid)) {
      var detail = spatialRefs.details[this.indexOfWkid(wkid)];
      var start = detail.indexOf("GEOGCS"),
        end = detail.indexOf("PROJECTION") - 1;
      return detail.slice(start, end);
    }

    return null;
  };

  mo.getCSStr = function(wkid) {
    return spatialRefs.details[this.indexOfWkid(wkid)];
  };

  mo.isSameSpheroid = function(tWkid, sWkid) {
    var tSpheroid = this.getSpheroidStr(tWkid),
      sSpheroid = this.getSpheroidStr(sWkid);

    if (tSpheroid && sSpheroid && tSpheroid === sSpheroid) {
      return true;
    }

    return false;
  };

  return mo;
});