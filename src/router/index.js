import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: () => import("../View/Home.vue")
        },

        {
         path: "/login",
         name: "Login",
         component: () => import("../View/Login.vue")   
        },
        {
            path: "/userpage",
            name: "UserPage",
            component: () => import("../View/UserPage.vue")
        }
    ]});

export default router

