const Listener = {
    resize: [],
    clickoutside: []
};

/**
 * 窗口大小改变触发事件
 */
// 定时器
let timerResize = null;
const resizeHandler = function (e) {
    timerResize && clearTimeout(timerResize);
    // 防止一直执行，造成运算量增加
    timerResize = setTimeout(() => {
        for (let i = 0, length = Listener.resize.length; i < length; i++) {
            if ('function' === typeof Listener.resize[i].fn) {
                Listener.resize[i].fn(e);
            }
        }
    }, 300);
}
window.addEventListener('resize', resizeHandler);
export const resize = {
    // 指令绑定时调用
    bind(el, binding, vnode, oldVnode) {
        if ('function' === typeof binding.value) {
            Listener.resize.push({
                name: binding.expression,
                fn(e) {
                    binding.value(el);
                }
            });
        }
    },
    // 绑定指令的元素插入DOM时调用
    inserted(el, binding, vnode, oldVnode) {
        if ('function' === typeof binding.value) {
            binding.value(el);
        }
    },
    // 绑定值变化时调用
    update(el, binding, vnode, oldVnode) {
        // console.log(el, binding, vnode, oldVnode)
    },
    componentUpdated(el, binding, vnode, oldVnode) {
        // console.log(el, binding, vnode, oldVnode)    

    },
    unbind(el, binding, vnode, oldVnode) {
        for (let i = 0, length = Listener.resize.length; i < length; i++) {
            if (Listener.resize[i].name === binding) {
                Listener.resize.splice(i, 1);
                break;
            }
        }
        if (!Listener.resize.length) {
            window.removeEventListener('resize', resizeHandler);
        }
    }
}

/**
 * 点击对象外部时触发事件
 */
let TimerClickOutSide = null;
const clickoutsideHandler = function (e) {
    TimerClickOutSide && clearTimeout(TimerClickOutSide);
    // 防止一直执行，造成运算量增加
    TimerClickOutSide = setTimeout(() => {
        for (let i = 0, length = Listener.clickoutside.length; i < length; i++) {
            if ('function' === typeof Listener.clickoutside[i].fn) {
                Listener.clickoutside[i].fn(e);
            }
        }
    }, 100);
}
document.addEventListener('click', clickoutsideHandler);
export const clickoutside = {
    // 指令绑定时调用
    bind(el, binding, vnode, oldVnode) {
        if ('function' === typeof binding.value) {
            Listener.clickoutside.push({
                name: binding.expression,
                fn(e) {
                    let inside = el.contains(e.target);
                    if (!inside) {
                        binding.value(el);
                    }
                }
            });
        }
    },
    // 绑定指令的元素插入DOM时调用
    inserted(el, binding, vnode, oldVnode) {
        if ('function' === typeof binding.value) {
            binding.value(el);
        }
    },
    // 绑定值变化时调用
    update(el, binding, vnode, oldVnode) {
        // console.log(el, binding, vnode, oldVnode)
    },
    componentUpdated(el, binding, vnode, oldVnode) {
        // console.log(el, binding, vnode, oldVnode)    

    },
    unbind(el, binding, vnode, oldVnode) {
        for (let i = 0, length = Listener.clickoutside.length; i < length; i++) {
            if (Listener.clickoutside[i].name === binding) {
                Listener.clickoutside.splice(i, 1);
                break;
            }
        }
        if (!Listener.length) {
            document.removeEventListener('click', clickoutsideHandler);
        }
    }
}