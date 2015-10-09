
var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync(__dirname + "/bower_components/jquery/dist/jquery.min.js", "utf-8");
var q_parallel = require("q-parallel");
var request = require("request");

function get(url, id, timeout, dir, category){
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
				var itemsImage = $(".l-content div.is_photo .post_thumbnail_container");
				var itemsVideo = $(".l-content div.is_video .post_thumbnail_container");
				var next = $("#next_page_link");
				if (next) {
					nextUrl = next.prop("href");
				}
				var images = [];
				if(!category || category == "image") {
					itemsImage && itemsImage.attr("data-imageurl", function (index, attr) {
						images.push(attr.replace("250", "1280"));
					});
				}
				if(!category || category == "video") {
					itemsVideo && itemsVideo.attr("data-imageurl", function (index, attr) {
						images.push("https://vt.tumblr.com/" + (/\/([^\/]+)$/.test(attr) && RegExp.$1).replace(/_frame.+/, "") + ".mp4");
					});
				}
				//console.log(images);return;
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
					function cb(err, response){
						if(err){
							console.log(err)
							if(fs.existsSync(path)){
								fs.unlinkSync(path);
							}
						}else{
							console.log(path)
						}
						defer.resolve(true);
					}
					var path = dir + "/" + (/\/([^\/]+)$/.test(item) && RegExp.$1);
					(item.indexOf(".mp4") > -1 ? request({
						url : item,
						timeout : (10000)
					}, cb) : request({
						url : item,
						timeout : (timeout || 10000)
					}, cb))
						.pipe(fs.createWriteStream(path))
				}, function () {
					if(nextUrl){
						console.log("next");
						window.close();
						get(nextUrl, id, timeout, dir, category);
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
module.exports = function (id, timeout, dir, category) {
	var url = "http://"+ id +".tumblr.com/archive";
	if(dir){
		if(!fs.existsSync(dir)) {
			console.log("dir not found:" + dir);
			return;
		}else{
			dir += "/" + id;
		}
	}
	get(url, id, timeout, dir, category);
}