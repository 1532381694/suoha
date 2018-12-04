import Vue from "vue"
import vueRouter from "vue-router"

import index from "./components/index"
import start from "./components/start"

Vue.use(vueRouter);
const routes=[
  {path:'/index',component:index},
  {path:'/start',component:start}
];
var router=new vueRouter({
  routes
});
export default router;
