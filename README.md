# Loading
为angular项目的页面或数据加载提供遮罩服务，for loading  

###### Author: xishiyi7
###### Date: 2016.05.27

### 使用说明

+ angular项目中注入'loading';
+ 通过对应的参数新建一个Loading实例;
+ 添加需要的style或者css;  

`example`
```
  var req = Menu.get(); //  这是一个模拟的resource请求
  
  // 如果不指明,可以不加
  var options = {
    promise:req,  // 必须有,可以是数组,且子项必须是promise对象
    scope:$scope,   // 注入的scope, 不传将取值element的scope
    element:$element, // 可以不加,不加表示全屏遮罩,加了表示局部遮罩
    templateUrl:templateUrl,  // 如果没有传入的模版,将以loading.html为模版文件
    message:'loading...', // 遮罩显示的文字内容
    size:20,  // 遮罩大小,代表20px
    background:'#fff',  // 遮罩背景
    style:{'margin-top':'50%'}, // 额外的内置样式
    css:'loading' // 额外的css
  }
  
  var success,error,other;  // 成功回调函数、失败回调函数
  
  var loading = new Loading(options,success,error);
  
  req.then(other);  // 在`req` resolve之后, 会执行成功回调函数success
```


