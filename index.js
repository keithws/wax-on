"use strict";

const fs = require("graceful-fs");
const path = require("path");

var blocks, Handlebars, layoutPath, cache;

blocks = {};
layoutPath = "";
cache = new Map();


/**
 * helper function to read layout file, set cache, and return file contents
 */
function cacheSet (name) {

    let contents, duration, file;

    if (process.env.NODE_ENV === "production") {
        duration = parseFloat(process.env.WAXON_CACHE) || 86400; // one day
    } else {
        duration = parseFloat(process.env.WAXON_CACHE) || 0; // zero
    }

    file = path.resolve(layoutPath, `${name}.hbs`);
    fs.accessSync(file, fs.constants.R_OK);
    contents = fs.readFileSync(file, { "encoding": "utf8" });
    if (duration > 0) {
        cache.set(name, {
            until: Date.now() + duration * 1000,
            contents: contents
        });
    }

    return contents;

}


/**
 * extends helper for Handlebars
 *
 * @arg name {String} the file name of the template to extend
 * @arg options {Object} the options hash
 * @returns {String} the template output
 */
function extendsHelper (name, options) {

    let contents, template;

    if (!options) {
        options = name;
        name = "default";
    }

    if (cache.has(name)) {
        let obj = cache.get(name);
        if (obj.until > Date.now()) {
            contents = obj.contents;
        } else {
            contents = cacheSet(name);
        }
    } else {
        contents = cacheSet(name);
    }

    this.layout = `${name}.hbs`;
    options.fn(this);
    delete this.layout;

    template = Handlebars.compile(contents);
    if (options.data) {
        let data = Handlebars.createFrame(options.data);
        data.layout = {
            "filename": `${name}.hbs`
        };
        options.data = data;
    }
    return template(this, { "data": options.data });

}


/**
 * block helper for Handlebars
 *
 * @arg name {String} the name of the block
 * @arg options {Object} the options hash
 * @returns {String} the template output
 */
function blockHelper (name, options) {

    var block, blockContent, contents, stack;

    if (!options) {
        options = name;
        name = null;
        throw "Missing required argument: name";
    }

    // check for parent block name
    if (options.data.parentBlockName) {

        // name = options.data.parentBlockName + "/" + name;

    }

    // store block name for later
    //options.data.parentBlockName = name;

    // get existing stack for named block
    stack = blocks[name] || [];

    // stack up the blocks so we can execute them in order later
    stack.push({
        "fn": options.fn,
        "context": this,
        "data": Handlebars.createFrame(options.data),
        "hash": options.hash
    });

    blocks[name] = stack;

    if (!this.layout) {

        // ok, it's later; empty the stack and execute those blocks!
        blockContent = "";
        while (stack.length) {

            block = stack.pop();
            contents = block.fn(block.context, { "data": block.data });

            switch (block.hash.mode) {
            case "append":
                blockContent = blockContent + contents;
                break;
            case "prepend":
                blockContent = contents + blockContent;
                break;
            default:
            case "replace":
                blockContent = contents;
                break;
            }

        }

        // remove the block
        delete blocks[name];

    }

    // trim parent block name
    //let blockNameAncestory = options.data.parentBlockName.split("/");
    //options.data.parentBlockName = blockNameAncestory.slice(0,-1).join("/");

    return new Handlebars.SafeString(blockContent);

}


/**
 * append (block) helper for Handlebars
 *
 * @arg name {String} the name of the block
 * @arg options {Object} the options hash
 * @returns {String} the template output block content appended
 */
function blockAppendHelper (name, options) {

    options.hash.mode = "append";
    return blockHelper.apply(this, arguments);

}


/**
 * prepend (block) helper for Handlebars
 *
 * @arg name {String} the name of the block
 * @arg options {Object} the options hash
 * @returns {String} the template output block content prepended
 */
function blockPrependHelper (name, options) {

    options.hash.mode = "prepend";
    return blockHelper.apply(this, arguments);

}


/**
 * setLayoutPath - set the path where to find layout files
 * TODO check if path exists and is readable
 *
 * @arg path {String} the path to the layout files
 * @returns {undefined}
 */
function setLayoutPath (path) {

    layoutPath = path;

}


/**
 * getHelpers - return just the helper functions
 *
 * @returns {Object} the Handlebars helper functions
 */
function getHelpers () {

    return {
        "extends": extendsHelper,
        "block": blockHelper,
        "append": blockAppendHelper,
        "prepend": blockPrependHelper
    };

}

function registerHelpersWith (handlebars) {

    Handlebars = handlebars || require("handlebars");
    Handlebars.registerHelper(getHelpers());

}

module.exports = {
    "on": registerHelpersWith,
    "setLayoutPath": setLayoutPath
};
