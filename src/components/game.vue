<template>
    <div class="gameSence">
      <card></card>
    </div>
</template>

<script>
  import card from "card"
    export default {
        name: "gameSence",
        components:{
          card:card
        }
    }
</script>

<style scoped>
  .gameSence{
    overflow: hidden;
    position: absolute;
    top:0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
    width: 600px;
    height: 600px;
    background: #080808;
  }
  card{
    position: absolute;
    overflow: hidden;
  }
</style>
