import Mock from 'mockjs'
console.log(Mock)

//Mock构造数据
var Random = Mock.Random //占位符生成随机数


Mock.mock('/api/mockpost','post',function(option){
    console.log(option)
    return Mock.mock({
        status:200,
        message:'提交成功',
    })
})