$(function() {
    getUserInfo();


    //实现退出功能
    var layer = layui.layer;


    $("#btn_logout").on('click', function() {
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function(index) {
            //do something
            //清除token
            localStorage.removeItem('token')

            //跳转
            location.href = '/login.html'

            //关闭confirm
            layer.close(index);
        });
    })

})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }

                renderAvatar(res.data)
            }
            // complete: function(res) {
            //     console.log(res);
            //     //res.responseJSON
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         //1. 强制清空token
            //         localStorage.removeItem('token');
            //         location.href = '/login.html'
            //     }
            // }
    })
}

function renderAvatar(user) {
    //获取用户名称
    var name = user.nickname || user.username

    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)

    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }
}