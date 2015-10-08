
var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + "/bower_components/jquery/dist/jquery.min.js", "utf-8");
var q_parallel = require("q-parallel");
var request = require("request");

function get(url, id, timeout, dir){
	jsdom.env({
		url: url,
		src: [jquery],
		headers: {
			//"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53"
		},
		done: function (errors, window) {
			var nextUrl;
			if (window) {
				var $ = window.$;
				var items = $(".l-content .post_thumbnail_container");
				var next = $("#next_page_link");
				if (next) {
					nextUrl = next.prop("href");
				}
				var images = [];
				items && items.attr("data-imageurl", function (index, attr) {
					images.push(attr);
				});
				q_parallel(images, 1, function (i, defer, item) {
					if(!dir) {
						dir = id;
						if (!fs.existsSync(dir)) {
							fs.mkdirSync(dir);
						}
					}else{
						if(!fs.existsSync(dir)){
							fs.mkdirSync(dir);
						}
					}
					var path = dir + "/" + (/\/([^\/]+)$/.test(item) && RegExp.$1).replace("250", "500");
					request({
						url : item,
						timeout : timeout || 10000
					})
						.on('response', function(response) {
							console.log(path)
							defer.resolve(true);
						})
						.on('error', function(err) {
							console.log(err)
							defer.resolve(true);
						})
						.pipe(fs.createWriteStream(path))
				}, function () {
					if(nextUrl){
						console.log("next");
						window.close();
						get(nextUrl, id, timeout, dir);
					}else{
						console.log("done");
					}
				});
			} else {
				if (errors) {
					console.log(errors);
				} else {
					console.log("window not found");
				}
			}
		}});
}
module.exports = function (id, timeout, dir) {
	var url = "http://"+ id +".tumblr.com/archive";
	if(dir){
		if(!fs.existsSync(dir)) {
			console.log("dir not found:" + dir);
			return;
		}else{
			dir += "/" + id;
		}
	}
	get(url, id, timeout, dir);
}