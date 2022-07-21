/*=======================================================================
 * FILE: htmlHelper.js
 * AUTHOR: Christopher McLeod
 * DATE: Winter 2021
 *
 * DESCIRPTION: Module to create dynamic html content.
 *               IS 542, Winter 2021, BYU
*/
/*jslint
    browser, long
*/
/*property
    anchor, classKey, content, div, element, freeze, href, id, link, listItem,
    listItemLink
*/

/*--------------------------------------------------------------------
*               CONSTANTS
*/
const TAG_LIST_ITEM = "li";

/*--------------------------------------------------------------------
*               PRIVATE METHODS
*/
const anchor = function (volume) {
    return `<a name="v${volume.id}" />`;
};

const div = function (parameters) {
    let classString = "";
    let contentString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.id !== undefined) {
        idString = ` id=${parameters.id}"`;
    }

    return `<div${idString}${classString}>${contentString}</div>`;
};

const element = function (tagName, content, elementClass) {
    let classString = "";

    if (elementClass !== undefined) {
        classString = ` class="${elementClass}"`;
    }

    return `<${tagName}${classString}>${content}</${tagName}>`;
};

const link = function (parameters) {
    let classString = "";
    let contentString = "";
    let hrefString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.href !== undefined) {
        hrefString = ` href=${parameters.href}`;
    }

    if (parameters.id !== undefined) {
        idString = ` id=${parameters.id}"`;
    }

    return `<a${idString}${classString}${hrefString}>${contentString}</a>`;
};

const listItem = function (content) {
    return element(TAG_LIST_ITEM, content);
};

const listItemLink = function (content, href = "") {
    return listItem(link({content, href: `#${href}`}));
};


/*--------------------------------------------------------------------
*               PUBLIC API
*/
const Html = {
    anchor,
    div,
    element,
    link,
    listItem,
    listItemLink
};

export default Object.freeze(Html);