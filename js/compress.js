/*数组删除扩展方法start*/
Array.prototype.indexOf = function(val) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == val) return i;
	}
	return -1;
};
Array.prototype.remove = function(val) {
	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};
/*数组删除扩展方法end*/
var compressUtil=(function(){
	//图片亚索算法  param为压缩比
	var compress=function(img,filetype,type) {
		var param = type;
		var initSize = img.src.length;
		var width = img.width;
		var height = img.height;
		var canvas = document.createElement('canvas');
		var tCanvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		var tctx = tCanvas.getContext('2d');
		//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
		var ratio;
		if((ratio = width * height / 4000000) > 1) {
			ratio = Math.sqrt(ratio);
			width /= ratio;
			height /= ratio;
		} else {
			ratio = 1;
		}

		canvas.width = width;
		canvas.height = height;

		//    铺底色
		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		//如果图片像素大于100万则使用瓦片绘制
		var count;
		if((count = width * height / 1000000) > 1) {
			count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片

			//        计算每块瓦片的宽和高
			var nw = ~~(width / count);
			var nh = ~~(height / count);

			tCanvas.width = nw;
			tCanvas.height = nh;

			for(var i = 0; i < count; i++) {
				for(var j = 0; j < count; j++) {
					tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);

					ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
				}
			}
		} else {
			ctx.drawImage(img, 0, 0, width, height);
		}

		//进行最小压缩
		var ndata = canvas.toDataURL(filetype, param);

		console.log("压缩前：" + conver(initSize));
		console.log("压缩后：" + conver(ndata.length));
		console.log("压缩率：" + (100 * (initSize - ndata.length) / initSize) + "%");

		tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

		return ndata;
	}
	//k转mb算法
	var conver=function(v) {
		v = eval(v / 1024 / 1024).toFixed(2) + "MB";
		return v;
	}
	//base64转二进制img对象
	var converbold=function(imgdata, type) {
		var text = window.atob(imgdata.split(",")[1]);
		var buffer = new ArrayBuffer(text.length);
		var ubuffer = new Uint8Array(buffer);

		for(var i = 0; i < text.length; i++) {
			ubuffer[i] = text.charCodeAt(i);
		}

		var Builder = window.WebKitBlobBuilder || window.MozBlobBuilder;
		var blob;
		if(Builder) {
			var builder = new Builder();
			builder.append(buffer);
			blob = builder.getBlob(type);
		} else {
			blob = new window.Blob([buffer], {
				type: type
			});
		}
		return blob;
	}
	var init=function(data,filetype,type){
        var img = new Image();
       	img.src = data;
	    return compress(img,filetype,type);
	}
	return{
		init:init,
		converbold:converbold
	}
})()