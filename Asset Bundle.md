# Asset Bundle 使用详解
在加载 Asset Bundle 时 不需要 额外提供对应的 Hash 值，
Creator 会在 settings.js 中查询对应的 Hash 值，并自动做出调整。
但如果你想要将相关版本配置信息存储在服务器上，
启动时动态获取版本信息以实现热更新，
你也可以手动指定一个版本 Hash 值并传入 loadBundle 中，
此时将会以传入的 Hash 值为准：

cc.assetManager.loadBundle('bundle name', {version: 'fbc07'}, function (err, bundle) {
    if (err) {
        return console.error(err);
    }
    console.log('load bundle successfully.');
});

这样就能绕过缓存中的老版本文件，重新下载最新版本的 Asset Bundle。

版本例子  
	config.fbc07.json
	version: 'fbc07'

热更新实现方式
cocos发布
玩家进游戏 
版本1 = 获取本地 cc.sys.localStorage 中存的版本信息
版本2 = 获取服务器 上的版本信息
有2就用2 加载bundle 然后 版本2 存入 cc.sys.localStorage
没有2 用1
没有1 不传 version 参数 直接加载

改变 bundle 里面的东西
cocos发布 
config.fbc07.json 
fbc07会变成新的
将新bundle文件夹放上服务器
服务器 上的版本信息 返回的是新的version

