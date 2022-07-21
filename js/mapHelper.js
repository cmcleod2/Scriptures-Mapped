/*=======================================================================
 * FILE: mapHelper.js
 * AUTHOR: Christopher McLeod
 * DATE: Winter 2021
 *
 * DESCIRPTION: Module to interact with google maps API.
 *               IS 542, Winter 2021, BYU
*/
/*jslint
    browser, long
*/
/*property
    Animation, DROP, LatLngBounds, animation, exec, forEach, getAttribute,
    getPosition, getTitle, labelClass, labelContent, lat, length, lng, map,
    maps, panTo, position, push, querySelectorAll, setMap, setOptions, setZoom,
    title
*/

/*--------------------------------------------------------------------
*               CONSTANTS
*/
const INDEX_FLAG = 11;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUTDE = 4;
const INDEX_PLACENAME = 2;
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;
const MARKER_LABEL_CLASS = "labels";

/*--------------------------------------------------------------------
*               PRIVATE VARIABLES
*/
let gmMarkers = [];

/*--------------------------------------------------------------------
*               PRIVATE METHODS
*/
const addMarker = function (placeName, latitude, longitude) {
    let isSame = false;
    gmMarkers.forEach(function (mark, i) {
        let lat = mark.getPosition().lat();
        let lng = mark.getPosition().lng();
        let title = mark.getTitle();
        if (lat === Number(latitude) && lng === Number(longitude) ) {
            if (title !== placeName) {
                gmMarkers[i].setOptions({labelContent: `${title}/${placeName}`});
            }
            isSame = true;
        }
    });

    if (isSame === false) {
        // Got this marker with label class from:
        //      https://github.com/googlemaps/js-markerwithlabel
        let marker = new markerWithLabel.MarkerWithLabel({
            position: {lat: Number(latitude), lng: Number(longitude)},
            map: map,
            title: placeName,
            labelContent: placeName,
            labelClass: MARKER_LABEL_CLASS,
            animation: google.maps.Animation.DROP
        });

        gmMarkers.push(marker);
    }
};

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null);
    });

    gmMarkers = [];
};

const setupMarkers = function (visableDiv) {
    if (gmMarkers.length > 0) {
        clearMarkers();
    }

    document.querySelectorAll(`#${visableDiv} a[onclick^=\"showLocation(\"]`).forEach(function (element) {
        let matches = LAT_LON_PARSER.exec(element.getAttribute("onclick"));

        if (matches) {
            let placeName = matches[INDEX_PLACENAME];
            let latitude = matches[INDEX_LATITUDE];
            let longitude = matches[INDEX_LONGITUTDE];
            let flag = matches[INDEX_FLAG];

            if (flag !== "") {
                placeName = `${placeName} ${flag}`;
            }

            addMarker(placeName, latitude, longitude);
        }
    });

    zoomMapToFitMarkers();
};

const showLocation = function (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    map.panTo({lat: latitude, lng: longitude});
    map.setZoom(viewAltitude/430);
};

const zoomMapToFitMarkers = function () {
    if (gmMarkers.length > 1) {
        let bounds = new google.maps.LatLngBounds();
        for (let i = 0; i < gmMarkers.length; i++) {
            bounds.extend(gmMarkers[i].getPosition());
        }
        map.fitBounds(bounds);
    } else if (gmMarkers.length > 0) {
        map.panTo(gmMarkers[0].getPosition());
        map.setZoom(11);
    } else {
        //map.panTo({lat: 31.7683, lng: 35.2137});
        map.setZoom(8);
    }
};

/*--------------------------------------------------------------------
*               PUBLIC API
*/
const MapHelper = {
    setupMarkers,
    showLocation
};

export default Object.freeze(MapHelper);