$(function() {
    var layer = layui.layer;
    var form = layui.form;

    //获取文章分类列表
    initArtCateList()


    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var indexAdd = null;

    $('#btnAddCate').on('click', function() {
        indexAdd =
            layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $('#dialog-add').html()
            })
    })

    // 需要通过代理
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {

                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList();
                layer.msg('新增分类成功')
                    //根据index 关闭
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        //弹出一个修改文章信息
        indexEdit =
            layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $('#dialog-edit').html()
            })

        var id = $(this).attr('data-id');
        //发请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('form-edit', res.data);
            }
        })
    })


    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败');
                }
                layer.msg('更新分类数据成功');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function(e) {

        var id = $(this).attr('data-id');
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除成功')
                    layer.close(index)
                    initArtCateList();
                }

            })

            layer.close(index);
        });
    })




})