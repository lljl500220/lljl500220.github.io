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
                text:'重生之我是vue老手',
                icon:'vue',
                link:'/vue/'
            },
            {
                text: "算法笔记",
                icon: "note",
                prefix: "/algorithm",
                children:[
                    {
                        text: "力扣每日训练",
                        icon: "code",
                        link: "/LeetCode/",
                    },
                    {
                        text: "修行",
                        icon: "code",
                        link: "/LearnAndUse/",
                    }
                ]
            },
            {
                text: "设计模式",
                icon: "note",
                link: "/designPattern/",
            },
            {
                text: "RXJS",
                icon: "note",
                link: "/rxjs/",
            }
        ],
    }, {
        text: "闲情逸致",
        icon: "/assets/icon/zheshan.svg",
        prefix: "/posts/carefree/",
        children: [
            "README.md",
            "electron.md",
            "python热力图.md"
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
