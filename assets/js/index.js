$(function() {
    // 调用getUserInfo 获取用户基本信息
    getUserInfo()
    var layer = layui.layer
    $('#btnLogout').on('click',function() {
        //提示用户是否需要退出
        layer.confirm('确认退出登录?', {icon: 3, title:'提示'}, function(index){
            //do something
            //1.清空本地存储中的token
            localStorage.removeItem('token')
            // 2.重现跳转到登录页面
            location.href = '/login.html'

            //3.关闭confirm询问框
            layer.close(index);
          });
    })
})

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置的对象
        success: function(res) {
            if(res.status!==0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用renderAvatar 渲染用户的头像
            // console.log(res);
            renderAvatar(res.data)
        }
        //挪到了全局变量的baseAPI中
        // complete: function(res) {
        //     console.log(res);
        //     //在complete 回调函数中,可以使用res.responseJSON拿到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！' ) {
        //         //1.强制清空 token 
        //         localStorage.removeItem('token')
        //         //2.强制跳转到登录页面
        //         location.href = '/login.html'
        //     }
        // }
    })
}

//渲染用户的头像
function renderAvatar(user) {
    //获取用户的名称
    var name = user.nickname || user.username
    //设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name)
    //渲染用户的头像
    if(user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src',user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        // 渲染文本头像
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first)
        $('.layui-nav-img').hide()
    }
}