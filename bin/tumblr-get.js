#!/usr/bin/env node

var program = require('commander');

program
	.version('0.0.1')
	.option('-i, --id [String]', 'id of tumblr')
	.option('-o, --output [String]', 'Dir to save the images, default is current path')
	.option('-t, --timeout [n]', 'timeout of requesting image, default is 10s')
	.option('-c, --category [String]', 'video or image')
	.parse(process.argv);

if(!program.id){
	console.log("tumblr id not found");
}else {
	require("../index")(program.id, program.timeout - 0, program.output, program.category);
}