import {navbar} from "vuepress-theme-hope";

export const zhNavbar = navbar([
    "/",
    {
        text: "走马江湖",
        icon: "/assets/icon/jiu_16.svg",
        prefix: "/posts/work",
        children: [
            "/README.md",
            {
                text: "EPD研发中心前端开发规范JS篇",
                icon: "html",
                link: "/JavaScript/",
            }
        ],
    }, {
        text: "砺剑",
        icon: "/assets/icon/jian_16.svg",
        prefix: "/posts/learn",
        children: [
            {
                text: "刷题笔记",
                icon: "edit",
                link: "/simulation/"
            }, {
                text: "学习笔记",
                icon: "note",
                link: "/note/",
            },
            {
                text: "算法笔记",
                icon: "code",
                link: "/algorithm/",
            },
            {
                text: "RXJS",
                icon: "code",
                link: "/rxjs/",
            }
        ],
    }, {
        text: "闲情逸致",
        icon: "/assets/icon/zheshan.svg",
        prefix: "/posts/carefree/",
        children: [
            "README.md",
            "electron.md"
        ],
    },{
        text: "闲谈",
        icon: "/assets/icon/yun.svg",
        prefix: "/posts/my/",
        children: [
            "README.md",
        ],
    }
]);
