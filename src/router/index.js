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
        },
      
        {
            path :"/register",
            name: "Register",
            component: () => import("../View/RegisterPage.vue")
        },
        {
        path: "/checkout",
        name: "Checkout",
        component: () => import("../View/checkout.vue"),
        props: true, 
        meta: { requiresAuth: true } 
        },
        {
        path: "/payment/success",
        name: "PaymentSuccess",
        component: () => import("../View/PaymentSuccess.vue"),
        meta: { requiresAuth: true }
        },
  

        {
        path: "/books/:id",           // ✅ Dynamic route with book ID param
        name: "BookDetail",
        component: () => import("../View/BookDetails.vue"),
        props: true,                  // ✅ Pass route params as props
        meta: { requiresAuth: false } // ✅ Public page (anyone can view book details)
        },
        {
            path:"/AdminPage",
            name:"AdminPage",
            component: () => import("../View/AdminPage.vue"),

           
        }
        ,{
            path:"/VoteView",
            name:"VoteView",
            component: () => import("../View/VoteView.vue"),
        },
        {
            path:"/AddBook",
            name:"AddBook",
            component:()=>import("../View/AddBook.vue")

        },
        {
            path:"/Vendors",
            name:"Vendors",
            component:()=>import("../View/Vendors.vue")

        },
        {
            path:"/Users",
            name:"Users",
            component:()=>import("../View/Users.vue")

        },
        {
            path:"/Search",
            name:"Search",
            component:()=>import("../View/SearchResult.vue")
        },
        {
path:"/couponform",
name:"CouponForm",
component:()=>import("../View/couponform.vue")  
        }
        
    ]});

export default router

