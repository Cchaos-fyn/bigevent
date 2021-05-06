$(function () {
  // document.write('<script src="/assets/js/article/art_list.js"></script>')
  var layer = layui.layer;
  var form = layui.form;
  initCate();

  //获取文章的信息
  initval();

  // 定义获取文章信息的方法
  function initval() {
    var id = localStorage.getItem("id");
    $.ajax({
      method: "GET",
      url: "/my/article/" + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章信息失败!");
        }
        // 表格的时候直接赋值
        form.val("formUserInfo", res.data);
        // 初始化富文本编辑器
        initEditor();
        // 1. 初始化图片裁剪器
        var $image = $("#image");
        $image.attr(
          "src",
          "http://api-breakingnews-web.itheima.net" + res.data.cover_img
        );

        // 2. 裁剪选项
        var options = {
          aspectRatio: 400 / 280,
          preview: ".img-preview",
        };

        // 3. 初始化裁剪区域
        $image.cropper(options);
        // 不是表格的时候用模板引擎
        // var htmlStr = template('form-pub',res.data)
        // $('#form-pub').html(htmlStr)
        // form.render()
      },
    });
  }
  // 定义加载文章的方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章分类失败!");
        }
        // 调用模板引擎,渲染分类的下拉菜单
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // 一定要记得导入form.render()方法 因为导入layui.js包之后还没生成 需要再重新渲染一下
        form.render();
      },
    });
  }

  //为选择封面按钮,绑定点击事件处理函数
  $("#btnChooseImage").on("click", function (e) {
    e.preventDefault();
    $("#coverFile").click();
  });

  //监听coverFile的change事件 获取用户选择的文件列表
  $("#coverFile").on("change", function (e) {
    // console.log(e);
    //   获取到文件的列表数组
    var files = e.target.files;
    // 判断用户是否选择了文件
    if (files.length === 0) {
      return;
    }
    // 重新为裁剪区域设置图片
    $("#image")
      .cropper("destroy")
      .attr("src", URL.createObjectURL(files[0]))
      .cropper({
        aspectRatio: 400 / 280,
        preview: ".img-preview",
      });
    // //根据文件创建对应的url地址
    // var newImgURL = URL.createObjectURL(files[0]);
    // //为裁剪区域重新设置图片
    // $image
    //   .cropper("destroy") // 销毁旧的裁剪区域
    //   .attr("src", newImgURL) // 重新设置图片路径
    //   .cropper(options); // 重新初始化裁剪区域
  });

  // 给表单确认修改按钮,绑定提交处理事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData($(this)[0]);
    // 3.将文章的发布状态,存到fd中
    var art_state = $("#art_state").val();
    fd.append("state", art_state);

    //4.将封面裁剪过后的图片,输出为一个文件对象
    $("#image")
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        fd.append("cover_img", blob);
        //6.发起ajax数据请求
        publishArticle(fd);
      });
    // fd.forEach(function(v,k) {
    //   console.log(k,v);
    // })
  });

  // 定义一个修改文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/edit",
      data: fd,
      //注意:如果向服务器提交的是FormData 格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改文章失败!");
        }
        layer.msg("修改文章成功!");
        location.href = "/article/art_list.html";
      },
    });
  }

  // 给取消按钮绑定一个点击事件
  $("#btn-reset").on("click", function () {
    location.href = "/article/art_list.html";
  });
});