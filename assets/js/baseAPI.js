//调用GET POST ajax 先调用 ajaxPrefilter
$.ajaxPrefilter(function(option) {
    // console.log(option.url);
    option.url = 'http://ajax.frontend.itheima.net' + option.url;

})