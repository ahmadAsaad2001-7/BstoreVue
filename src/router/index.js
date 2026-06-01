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
            path: "/books/:id",
            name: "BookDetail",
            component: () => import("../View/BookDetails.vue"),
            props: true,
            meta: { requiresAuth: false }
        },
        {
            path: "/AdminPage",
            name: "AdminPage",
            component: () => import("../View/AdminPage.vue"),
            meta: { requiresAdmin: true }
        },
        {
            path: "/VoteView",
            name: "VoteView",
            component: () => import("../View/VoteView.vue"),
            meta: { requiresAdmin: true }
        },
        {
            path: "/AddBook",
            name: "AddBook",
            component: () => import("../View/AddBook.vue"),
            meta: { requiresAuth: true, requiresVendor: true }
        },
        {
            path: "/Vendors",
            name: "Vendors",
            component: () => import("../View/Vendors.vue")
        },
        {
            path: "/Users",
            name: "Users",
            component: () => import("../View/Users.vue")
        },
        {
            path: "/Search",
            name: "Search",
            component: () => import("../View/SearchResult.vue")
        },
        {
            path: "/couponform",
            name: "CouponForm",
            component: () => import("../View/couponform.vue"),
            meta: { requiresAdmin: true }
        },
        {
          path: "/CartPage",
          name: "CartPage",
          component: () => import("../View/CartPage.vue"),
          meta: { requiresAuth: true }
        }
    ]
});

router.beforeEach(async (to, from, next) => {
  const { useAuthStore } = await import("../Stores/Auth.js");
  const authStore = useAuthStore();
  
  if (authStore.loading) {
    await new Promise(resolve => {
      const check = () => {
        if (!authStore.loading) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }

  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    if (!authStore.isAuthenticated) {
      return next('/login');
    }
  }

  if (to.meta.requiresAdmin) {
    if (!authStore.user?.roles?.includes('ADMINISTRATOR')) {
      return next('/');
    }
  }

  if (to.meta.requiresVendor) {
    if (!authStore.isVendor) {
      return next('/');
    }
  }
  
  next();
});

export default router;
