<template>
  <div id="app">
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <router-link to="" class="navbar-brand">TOP</router-link>
        <ul class="nav navbar-nav menu">
          <li class="active">
            <router-link to="/index">首页</router-link>
          </li>
          <li>
            <router-link to="/start">游戏开始</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
import {demo} from './components/demo'
import Vue from 'vue'

let com=new Vue(demo)

console.log(com);
export default {
  name: 'app',
}
$(function(){
  $(".menu li").click(function(){
    $(this).addClass("active");
    $(this).siblings().removeClass("active");
  })
});
</script>

<style scoped>
  .navbar{
    margin-bottom: 50px;
  }
  label{
    line-height: 34px;
  }
  input{
    border-radius: 10px !important;
  }

</style>
