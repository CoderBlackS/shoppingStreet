import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const Home = () => import('views/home/Home');
const Category =() => import('views/category/Category');
const Cart =()=> import('views/shopcart/Shopcart');
const Profile =() => import('views/profile/Profile');
const DDetail =() => import('views/detail/Detail');

const routes = [
  {
    path:'',
    redirect:'/home'
  },
  {
    path:'/home',
    component:Home
  },
  {
    path:'/category',
    component:Category
  },
  {
    path: '/cart',
    component:Cart
  },
  {
    path: '/profile',
    component:Profile
  },
  {
    path: '/detail/:id',
    component:DDetail
  }
  ]

const router =  new VueRouter({
    routes,
    mode:'history'
})

// router.beforeEach((to, from, next) => {
//   console.log(to, '前置第一个参数')
//   console.log(from, '前置第二个参数')
//   console.log(next, '前置第三个参数')
//   next();
//   // /
//   // to 目标路由
//   // from 源路由
//   // next 跳转到下一个路由
// });

export default router;
