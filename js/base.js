var upload = function (datalist) {
    var weuiimgbox, weuiimgupload, weuidel, weuifile, weuiimglist, weuiimguploadbox,
        iconfont, bg, weuiimgli;
    var weuiurlList = [];//图片地址
    var success,err;
    var config = {
        ico: 1,//上传图标的样式
        type: 1,//样式类型
        deltitle: '是否删除上传图片?',//删除提示标题
        data: datalist,
        tiptitle:'请选择上传文件',
        success:function(){},
        err:function(){},
        del:function(){}
    }
    var icolist = ['', 'tupian', 'wenjian'];
    weuiimgbox = document.getElementById(config.data.id);//主盒子初始化
    weuiimglist = weuiimgbox.getElementsByClassName('weui-imglist')[0];
    weuiimguploadbox = weuiimgbox.getElementsByClassName('weui-imgupload-box')[0];
    weuiimgupload = weuiimgbox.getElementsByClassName('weui-imgupload')[0];
    iconfont = weuiimgbox.getElementsByClassName('iconfont')[0];
    /*背景图展示模块*/
    bg = document.getElementsByClassName('weui-bg')[0];
    bg.addEventListener("click", function (e) {
        bg.style.height = '0';
    });
    /*上传按钮初始化end*/
    /*添加数据后 展示列表盒子初始化*/
    weuiimgli = weuiimgbox.getElementsByClassName('weui-imgli');
    weuidel = weuiimgbox.getElementsByClassName('weui-del');
    var configinit = function () {
        /*绑定成功和失败回调函数*/
        config.success=datalist.success;
        config.err=datalist.err;
        config.del=datalist.del;
        if (typeof(config.data) != 'undefined') {
            /*样式类型参数*/
            if (typeof(config.data.type) != 'undefined'&&config.data.type!='') {
                config.type = config.data.type;
                weuiimgbox.className += ' weui-style' + config.type;
            } else {
                weuiimgbox.className += ' weui-style' + config.type;
            }
            /*数据绑定*/
            if (typeof(config.data.data) != 'undefined') {
                if (config.data.data.length != 0) {
                    var first = config.data.data[0];
                    if (config.type == 1) {
                        createImg(first);
                    } else if (config.type == 2) {
                        for (var i = 0; i < config.data.data.length; i++) {
                            var o = config.data.data[i];
                            createImg(o);
                        }
                    } else if (config.type == 3) {
                        createImg(first);
                    }
                }
            }
            /*删除提示语*/
            if (typeof(config.data.deltitle) != 'undefined'&&config.data.deltitle!='') {
                config.deltitle = config.data.deltitle;
            }
             /*上传按钮提示语*/
            if (typeof(config.data.tiptitle) != 'undefined'&&config.data.tiptitle!='') {
                config.tiptitle = config.data.tiptitle;
            }
            /*图标样式的绑定*/
            if (typeof(config.data.ico) != 'undefined'&&config.data.ico!='') {
                config.ico = config.data.ico;
                iconfont.className = 'iconfont icon-' + icolist[config.ico];
            } else {
                iconfont.className = 'iconfont icon-' + icolist[1];
            }
        }
    }
    var init = function () {
        configinit();
        if (weuiimgbox.className.indexOf('weui-style1') > -1) {
            weuiimgupload.innerHTML += config.tiptitle;
        }
        weuifile = weuiimgbox.getElementsByClassName('weui-file')[0];
        weuifile.addEventListener("change", function (e) {
            file = e.target.files[0];
            if (file.type.indexOf('image') != -1) {
            	iconfont.className = 'iconfont icon-' + 'dengdai';
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    var compressData = compressUtil.init(this.result, file.type, 0.8);
                    createImg(compressData);
                    iconfont.className = 'iconfont icon-' + icolist[config.ico];
                    config.success(compressUtil.converbold(compressData,file.type));
                }
            } else {
                config.err('文件格式错误,请选择图片文件上传');
            }
        });
    };
    var createImg = function (result) {
        var div = document.createElement("div");
        div.className = 'weui-imgli';
        var img = document.createElement("img");
        img.className = 'weui-img';
        img.src = result;
        weuiurlList.push(img.src);
        var del = document.createElement('div');
        del.className = 'weui-imgupload weui-del';
        var i = document.createElement('span');
        i.className = 'iconfont icon-del';
        del.appendChild(i);
        if (config.type == 1) {
            weuiimguploadbox.className += ' ' + 'weui-active';
            del.innerHTML += config.deltitle;
        } else if (config.type == 2) {
        	weuiimguploadbox.className += ''
        } else if (config.type == 3) {
            weuiimguploadbox.className += ' ' + 'weui-active';
        }
        div.appendChild(img);
        div.appendChild(del);
        imgEvent(img);
        delEvent(div);
        weuiimglist.appendChild(div);
    };
    var delEvent = function (div) {
        var img = div.getElementsByClassName('weui-img')[0];
        var del = div.getElementsByClassName('weui-del')[0];
        del.addEventListener("click", function (e) {
            if (confirm(config.deltitle)) {
                weuiurlList.remove(img.src);
                for(var i=0;i<weuiimgli.length;i++){
                    if(weuiimgli[i]==div){
                        config.del(i);
                        div.remove();
                    }
                }
                if (config.type == 1) {
                    weuiimguploadbox.className = 'weui-imgupload-box';
                }
            }
        });
    }
    var imgEvent = function (img) {
        img.addEventListener("click", function (e) {
            var i = document.createElement("img");
            i.className = 'weui-img';
            i.src = img.src;
            bg.innerHTML = '';
            bg.appendChild(i);
            bg.style.height = '100%';
        });
    }
    init();

};

