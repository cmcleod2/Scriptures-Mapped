/*=======================================================================
 * FILE: scriptures.js
 * AUTHOR: Christopher McLeod
 * DATE: Winter 2021
 *
 * DESCIRPTION: Front-end JavaScript code for The Scriptures, Mapped.
 *               IS 542, Winter 2021, BYU
*/
/*jslint
    browser, long
*/
/*property
    freeze, init, onHashChanged, showLocation
*/

/*--------------------------------------------------------------------
*               IMPORTS
*/
import MapScripApi from "./mapScripApi.js";
import MapHelper from "./mapHelper.js";
import onHashChanged from "./navigation.js";

/*--------------------------------------------------------------------
*               PUBLIC API
*/

const Scriptures = {
    init: MapScripApi.init,
    onHashChanged,
    showLocation: MapHelper.showLocation
};

export default Object.freeze(Scriptures);