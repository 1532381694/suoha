<template>
  <div class="card" :class="[className]">
    <p>{{value}}</p>
  </div>
</template>

<script>
    export default {
      name: "card",
      props:["value","className"]
    }
</script>

<style scoped>
  .card {
    position: absolute;
    width: 75px;
    height: 110px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 3px 3px 7px rgba(0,0,0,0.3);
  }
  .card p {
    margin: 0; padding: 0;
    text-align: center;
    font: 50px/110px Georgia, Times New Roman, serif;
  }
  .suitHeart:before, .suitHeart:after{
    content: "♥";
    color: #ff0000;
  }
  .suitBlock:before, .suitBlock:after{
    content: "♦";
    color: #ff0000;
  }
  .suitClub:before, .suitClub:after{
    content: "♣";
    color: #000000;
  }
  .suitSpade:before, .suitSpade:after{
    content: "♠";
    color: #000000;
  }
  .card:hover{
    box-shadow: 2px 2px 16px rgba(0,0,0,1);
  }
  .suitSpade p,.suitClub p{
    color: black;
  }
  .suitHeart p,.suitBlock p{
    color: red;
  }
  div[class*='suit']:before {
    position: absolute;
    font-size: 17px;
    left: 4px;
    top: 4px;
  }
  div[class*='suit']:after {
    position: absolute;
    font-size: 17px;
    right: 4px;
    bottom:4px;
  }
</style>
