//调用GET POST ajax 先调用 ajaxPrefilter
$.ajaxPrefilter(function(option) {
    // console.log(option.url);
    option.url = 'http://ajax.frontend.itheima.net' + option.url;


    if (option.url.indexOf('/my/') !== -1) {
        //统一为有权限的接口 设置 headers请求头
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    option.complete = function(res) {

        //res.responseJSON
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1. 强制清空token
            localStorage.removeItem('token');
            location.href = '/login.html'
        }

    }

})