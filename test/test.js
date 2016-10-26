/* globals describe it */

"use strict";

const assert = require("assert");
const Handlebars = require("handlebars");
const wax = require("..");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const testFiles = path.resolve(__dirname, "files");

/**
 * assertEqualHTML - helper function to compare HTML strings
 * @arg {String} 
 * @arg {String}
 * @returns {boolean}
 */
function assertEqualHTML (actual, expected) {

    let a, b;

    a = cheerio.load(actual, { "normalizeWhitespace": true }).html();
    b = cheerio.load(expected, { "normalizeWhitespace": true }).html();

    return assert.equal(a, b);

}

describe("Wax On", function () {

    before(() => {

        // runs before all tests in this block
        // register Wax On helpers with Handlebars
        wax.on(Handlebars);
        wax.setLayoutPath(testFiles);

    });

    describe("#on()", function () {

        it("should add the extends and block halpers to Handlebars", function () {

            let template = Handlebars.compile("{{#block \"content\"}}{{/block}}");
            template({});

        });

    });

    describe("#setLayoutPath()", function () {

        it("should set the file path to the layouts", function () {

            let template = Handlebars.compile("{{#extends \"layout\"}}{{/extends}}");
            template({});

        });

    });

    describe("Helpers", function () {

        it("should allow a template to extend a layout", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-a.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({
                    "title": "Page A",
                    "pets": [
                        "cat",
                        "dog"
                    ]
                });

                // read html file for result
                fs.readFile(path.join(testFiles, "page-a.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });
        it("should allow a template to extend a parent template", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-b.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({
                    "title": "Page B",
                    "pets": [
                        "mouse",
                        "fish"
                    ]
                });

                // read html file for result
                fs.readFile(path.join(testFiles, "page-b.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });
        it("should allow a template to append / prepend blocks of content", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-c.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({});

                // read html file for result
                fs.readFile(path.join(testFiles, "page-c.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });
        it("should allow a template to append / prepend blocks of content with append/prepend helpers", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-d.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({});

                // read html file for result
                fs.readFile(path.join(testFiles, "page-d.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });
        it("should allow a template to extend a parent template and define new blocks", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-e.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({});

                // read html file for result
                fs.readFile(path.join(testFiles, "page-e.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });
        it("should allow a template to extend a parent template and redefine the same block", function (done) {

            // read template from file
            fs.readFile(path.join(testFiles, "page-f.hbs"), "utf8", (err, data) => {

                if (err) throw err;

                let template = Handlebars.compile(data);
                let html = template({});

                // read html file for result
                fs.readFile(path.join(testFiles, "page-f.html"), "utf8", (err, data) => {

                    if (err) throw err;

                    let actual = html;
                    let expected = data;
                    assertEqualHTML(actual, expected);
                    done();

                });

            });

        });

    });

});
