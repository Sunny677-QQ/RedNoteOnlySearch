// 1. 定义要注入的 CSS：隐藏内容流，但强制显示 Header

// 包含了对新版、旧版以及各种侧边栏容器的隐藏处理

const HIDE_CSS = `

    /* 隐藏瀑布流核心容器 */

    #exploreFeeds,          /* 新版首页 ID */

    #mfContainer,           /* 旧版 ID */

    .feed-container,        /* 通用类名 */

    .interaction-container, /* 某些布局下的互动区 */



    /* 隐藏侧边栏（如果存在） */

    .side-bar,



    /* 暴力隐藏主内容区下方的流 (保留第一个 child 通常是 header，或者是 header 的占位) */

    .main-container > div:not(:first-child) {

        display: none !important;

        opacity: 0 !important;

        pointer-events: none !important;

    }



    /* 再次确保 Header 是显示的 */

    header,

    .header-container,

    .sticky-header {

        display: block !important;

        opacity: 1 !important;

        visibility: visible !important;

        z-index: 9999 !important;

    }



    /* 背景纯白 */

    body {

        background-color: #fff !important;

    }





    .right {

        display: none !important;

    }

    .mask-paper {

      background: none!important;

      backdrop-filter: none!important;

      min-height: 100vh;

    }

      #link-guide{
      position: absolute;

      top: 35%;

      }

    .input-box {

      top: 35%;

      left: 55% !important;

    }

`



let styleElement = null



// 2. 插入样式的函数

function enableFocusMode() {

    if (document.getElementById('xhs-focus-style')) return // 防止重复插入



    styleElement = document.createElement('style')

    styleElement.id = 'xhs-focus-style'

    styleElement.textContent = HIDE_CSS;

    (document.head || document.documentElement).appendChild(styleElement)

    console.log('✅ 小红书专注模式：已开启')

}



// 3. 移除样式的函数

function disableFocusMode() {

    const existingStyle = document.getElementById('xhs-focus-style')

    if (existingStyle) {

        existingStyle.remove()

        styleElement = null

        console.log('❌ 小红书专注模式：已关闭 (进入详情页)')

    }

}



// 4. 路由检查逻辑

function checkRoute() {

    const path = window.location.pathname



    // 逻辑：只有在 "首页 (/)" 或者 "发现页 (/explore)" 且没有后续 ID 时才隐藏

    // 比如 https://www.xiaohongshu.com/explore -> 隐藏

    // 比如 https://www.xiaohongshu.com/explore/123456 -> 显示 (这是帖子详情)

    const isHomePage = path === '/' || (path === '/explore' && !path.endsWith('/'))



    if (isHomePage) {

        enableFocusMode()

    } else {

        disableFocusMode()

    }

}



// 5. 监听 URL 变化 (SPA 核心处理)

// 由于 Chrome 扩展在 Isolated World，无法直接拦截 history.pushState

// 这里使用 MutationObserver 配合 URL 检查，这是最稳健的方法

let lastUrl = location.href



// 页面刚加载时检查一次

checkRoute()



// 创建观察者，当 DOM 发生变化时检查 URL 是否变了

const observer = new MutationObserver(() => {

    if (location.href !== lastUrl) {

        lastUrl = location.href

        checkRoute()

    }

})



// 监听 body 的变化 (subtree: true 保证能监控到整个页面的变动)

observer.observe(document, { subtree: true, childList: true })



// 额外监听 popstate (浏览器的前进后退按钮)

window.addEventListener('popstate', checkRoute)