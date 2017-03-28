# vue-calendar

> a calendar component for Vue.js

这是一个基于vue2.0仿 Trello 滚动切换日历的Demo。
参考了github的项目（https://github.com/diaocheng/calendar）
结合自身项目需求，修复了一些bug，增加了一些新功能
具体请看[Demo](https://wuyaoxing.github.io/calendar/)和源码

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

```

TODO
日历插件还需要完善
- 滚动切换目前使用的是直接控制scrollTop的值，本来打算使用jquery的动画去做，考虑到目前的流行趋势便作罢，目前正在寻求新的解决方案。
- 滚动和切换时会出现当月日历不在正中央，这个问题依赖于滚动动画，目前的js算法可能存在问题，上一个问题解决后这个问题便迎刃而解了。


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
