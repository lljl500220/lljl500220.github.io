import {navbar} from "vuepress-theme-hope";

export const zhNavbar = navbar([
    "/",
    {
        text: "走马江湖",
        icon: "/assets/icon/jiu_16.svg",
        prefix: "/posts/work/",
        children: [
            "README.md"
        ],
    }, {
        text: "砺剑",
        icon: "/assets/icon/jian_16.svg",
        children: [
            {
                text: "刷题笔记",
                prefix: "/posts/learn/simulation/",
                children: [
                    "README.md"
                ]
            }, {
                text: "学习笔记",
                prefix: "/posts/learn/note/",
                children: [
                    "README.md"
                ]
            },
        ],
    }, {
        text: "闲情逸致",
        icon: "/assets/icon/zheshan.svg",
        prefix: "/posts/carefree/",
        children: [
            "README.md"
        ],
    },
]);
