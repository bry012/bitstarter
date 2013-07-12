#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://sleepy-garden-9793.herokuapp.com/";
var SAVED_DEFAULT = '/home/ubuntu/Github/bitstarter/grader.txt';

var assertFileExists = function(infile) {
    
    var instr = infile.toString();

    if(! fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var write_file = function(chosen_file, data){
    fs.writeFile(chosen_file, data, function(err){
    if (err){
            console.log(err);
    } else {
           console.log('File was saved to ' + chosen_file + '.');
    }
});
};

var checkUrl = function(url,checksfile, chosen_file){
    rest.get(url).on('complete',function(data) {
    $ = cheerio.load(data);
    json_out =  check_out($,checksfile)
    var outJ = JSON.stringify(json_out, null, 4);
    write_file(chosen_file,outJ);
});
};

var checkHtmlFile = function(htmlfile, checksfile, chosen_file) {
    var $ = cheerioHtmlFile(htmlfile);
    var checkJson =  check_out($,checksfile);
    var outJson = JSON.stringify(checkJson, null, 4);
    write_file(chosen_file, outJson);
};

var check_out = function($, checksfile){
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists))
        .option('-u, --url [url]', 'Url to index.html') 
        .option('-f, --file [html_file]', 'Path to index.html', clone(assertFileExists))
        .option('-s --save <saved_file>', 'Path to output file', SAVED_DEFAULT)
        .parse(process.argv);

    if (program.file){
	checkHtmlFile(program.file, program.checks, program.save);
			}
    else if (program.url){
	checkUrl(program.url, program.checks, program.save);
    }  
   else {
       console.log('No file or url entered.');
       }

} else {
    exports.checkHtmlFile = checkHtmlFile;
}




