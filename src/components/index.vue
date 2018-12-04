<template>
  <div class="content" id="app">
    <div class="panel panel-info" style="display: none">
      <div class="panel-heading">用户信息</div>
      <div class="panel-body">
        <p class="text-center row">
          <strong class="col-sm-3">地址:</strong>
          <span class="col-sm-9">{{address}}</span>
        </p>
        <hr>
        <p class="text-center row">
          <strong class="col-sm-3">盈利:</strong>
          <span class="col-sm-8 col-sm-offset-1">{{balance}}</span>
        </p>
        <hr>
        <p class="text-center row">
          <strong class="col-sm-3">对局:</strong>
          <span class="col-sm-8 col-sm-offset-1">{{count}}</span>
        </p>
        <hr>
        <p class="text-center row">
          <strong class="col-sm-4">最大投注:</strong>
          <span class="col-sm-8">{{max}}</span>
        </p>
        <hr>
        <p class="text-center row">
          <strong class="col-sm-4">最小投注:</strong>
          <span class="col-sm-8">{{min}}</span>
        </p>
        <hr>
        <p class="info text-center">
          <span>对局信息>>></span>
        </p>
        <hr>
        <button class="btn btn-default btn-logout" @click="logout()">退出登录</button>
      </div>
    </div>
    <div class="panel panel-login">
      <div class="panel-heading">登录</div>
      <div class="panel-body">
        <form action="javascript:" class="form form-horizontal">
          <div class="form-group">
            <label class="col-sm-2">账户</label>
            <div class="input-group col-sm-9">
              <span class="input-group-addon">0x</span>
              <input type="text" class="form-control address">
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2">密码</label>
            <div class="input-group col-sm-9">
              <input type="password" class="form-control pass">
            </div>
          </div>
          <div class="row">
            <button class="col-sm-6 btn-login" @click="login()">登录</button>
          </div>
        </form>
      </div>
    </div>
    <div class="game">
      <div class="game-sence">
        <div class="mark">
          <p>奖金池:{{AllBalance}}eth</p>
        </div>
        <div class="allCard">
          <cardBack></cardBack>
        </div>
        <ul class="game-other">
          <li>
            <cardBack></cardBack>
          </li>
          <li>
            <card :className="clazzOther[0]" :value="cardOtherValue[1]"
                  :class="[cardOtherValue[1]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzOther[1]" :value="cardOtherValue[2]"
                  :class="[cardOtherValue[2]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzOther[2]" :value="cardOtherValue[3]"
                  :class="[cardOtherValue[3]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzOther[3]" :value="cardOtherValue[4]"
                  :class="[cardOtherValue[4]==undefined?'no-card':'']"></card>
          </li>
        </ul>
        <ul class="game-self">
          <li>
            <card :className="clazzSelf[0]" :value="cardSelfValue[0]"
                  :class="[cardSelfValue[0]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzSelf[1]" :value="cardSelfValue[1]"
                  :class="[cardSelfValue[1]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzSelf[2]" :value="cardSelfValue[2]"
                  :class="[cardSelfValue[2]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzSelf[3]" :value="cardSelfValue[3]"
                  :class="[cardSelfValue[3]==undefined?'no-card':'']"></card>
          </li>
          <li>
            <card :className="clazzSelf[4]" :value="cardSelfValue[4]"
                  :class="[cardSelfValue[4]==undefined?'no-card':'']"></card>
          </li>
        </ul>
      </div>
      <div class="btn-control">
        <button @click="startGame()" :class="{'anima':btn[0]}">{{startMsg}}</button>
        <button :class="{'anima':btn[1]}" @click="giveCard()">发牌</button>
        <button :class="{'anima':btn[2]}" @click="giveUp()">认输</button>
        <input :class="{'anima':btn[3]}" v-model="postValue"/>
        <button :class="{'anima':btn[4]}" @click="postValue()">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
  import card from "./card"
  import cardBack from "./cardBack"
  import main from'./index'

  console.log(main);

  let round = 0;
  /**
   * self 玩家的连接信息
   * index :客户端在服务器中的位置
   * playIndex: 玩家在连接池中的位置
   * player:  玩家的对手 address
   * homeIndex: 房间号
   */
  let self = {};
  //定义花色
  const color = {
    suitSpade: '3', //黑桃 'suitSpade'
    suitHeart: '2', //红桃 'suitHeart'
    suitClub: '1',  //梅花 'suitClub'
    suitBlock: '0'  //方块 'suitBlock'
  };
  let clazzOther = [];
  let clazzSelf = [];
  let cardSelfValue = [];
  let cardOtherValue = [];
  let btn=[true, false, false, false, false];
                //发牌    认输   下注    提交
  let MaxValue = 0.001; //当前最大的下注数 0.001eth
  let opssite = 0;        //对手的下注金额
  let AllBalance;

  /**
   * 比较大小的映射
   */
  let Mapping = {
    'A': 13,
    'K': 12,
    'Q': 11,
    'J': 10,
    '10': 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
    '2': 1
  };
  let ws = new WebSocket("ws://localhost:8001");
  ws.onopen = () => {
    console.log("connection have been done");
    ws.send("Hello World");
  };
  ws.onmessage = msg => {
    let msgObj = JSON.parse(msg);
    self.index = parseInt(msg.data);
    switch (msgObj.status) {
      case 200:                             //返回在服务器中的位置
        self.index = msgObj.index;
        break;

      case 201:                             //获取在玩家池中的位置
        self.playIndex = msgObj.playIndex;
        break;

      case 202:                             //发牌
        getCardFromServer(msgObj);
        break;

      case 203:                             //获取对手的地址
        self.address = msgObj.address;
        self.homeIndex = msgObj.homeIndex;
        break;

      case 204:                             //获取到对手下注的信息
        getMoney(msgObj.value);
        break;
    }
  };

  /**
   * status:202  发牌函数
   * 接受到服务端的发牌函数
   * @param msgObj
   */
  function getCardFromServer(msgObj) {
    //更新回合数
    round = msgObj.round;
    //牌发送给谁
    if (msgObj.address == self.address) {
      cardOtherValue[round] = msgObj.card.value;
      clazzOther[round] = msgObj.card.kind;
    } else {
      cardSelfValue[round] = msgObj.card.value;
      clazzSelf[round] = msgObj.card.kind;
    }
    challenge();
  }
  /**
   * 获取到对手的投注信息
   * 设置投注按钮可用
   * 设置提交按钮可用
   * @param value
   */
  function getMoney(value) {
    opssite = value;
    AllBalance+=parseFloat(value);
    btn[3]=true;
    btn[4]=true;
  }
  /**
   * 判断一个对象是否为null对象
   * @param obj
   * @returns {boolean}
   */
  function isEmpty(obj) {
    for (let name in obj) {
      return false;
    }
    return true;
  }

  /**
   * 比较两幅手牌谁大谁小
   * @param arr
   */
  function getMaxRange (arr1, arr2) {
    let obj1 = {};
    let obj2 = {};
    for (let value in arr1) {
      if (obj1[arr1[value]]) {
        obj1[arr1[value]]++;
      } else {
        obj1[arr1[value]] = 1;
      }
    }
    for (let value in arr2) {
      if (obj2[arr2[value]]) {
        obj2[arr2[value]]++;
      } else {
        obj2[arr2[value]] = 1;
      }
    }
    let key1 = '0'
    let count1 = 0;
    let key2 = '0'
    let count2 = 0;
    /**
     * 找出出现次数最多的扑克
     */
    Object.keys(obj1).forEach((key) => {

      if (obj1[key] >= count1) {
        //出现次数一样 但是点数大
        if (Map[key] > Map[key1] && obj1[key] == count1) {
          key1 = key;
        } else if (obj1[key] > obj1[key1]) {  //出现
          key1 = key;
          count1 = obj1[key];
        }
      }
      if (obj1[key1] == undefined) {
        key1 = key;
        count1 = obj1[key];
      }
    });
    Object.keys(obj2).forEach((key) => {
      if (obj2[key] >= count2) {
        //出现次数一样 但是点数大
        if (Map[key] > Map[key2] && obj2[key] == count2) {
          key2 = key;
        } else if (obj2[key] > obj2[key2]) {  //出现
          key2 = key;
          count2 = obj2[key];
        }
      }
      if (obj2[key2] == undefined) {
        key2 = key;
        count2 = obj2[key];
      }
    });
    //console.log(key1 + ":" + count1);
    //console.log(key2 + ":" + count2);
    if (count1 > count2) {
      return 1;
    } else if (count1 == count2 && Map[key1] > Map[key2]) {
      return 1;
    } else if (count1 == count2 && Map[key1] == Map[key2]) {
      delete obj1[key1]
      delete obj2[key2]
      if (isEmpty(obj1) && isEmpty(obj2)) {
        return 0
      } else {
        let newArr1 = [];
        let newArr2 = [];
        Object.keys(obj1).forEach((key) => {
          for (let i = 0; i < obj1[key]; i++) {
            newArr1.push(key);
          }
        });
        Object.keys(obj2).forEach((key) => {
          for (let i = 0; i < obj2[key]; i++) {
            newArr2.push(key);
          }
        })
        return getMaxRange(newArr1, newArr2);
      }
    } else {
      return 2
    }
  }
  /**
   * 比较大小
   * 1、当前玩家的点数是否大于对手
   *    大于:玩家可下注 可认输
   *    cardSelfValue
   *    cardOtherValue
   *    clazzSelf
   *    clazzOther
   */
  function challenge () {
    if(cardSelfValue.length=cardOtherValue.length){
      let value = this.getMaxRange(cardSelfValue,cardOtherValue);
      //一样大
      if (value == 0) {
      } else if (value == 1) {//玩家赢
        btn[4] = true;        //玩家可下注
        btn[2] = true;        //玩家可认输
      } else {                //对手赢 value=2
        btn[4] = false;       //玩家不可下注
        btn[2] = false;       //玩家不可认输
      }
    }
  }

  export default {
    name: "index",
    data: function () {
      return {
        startMsg: "开始游戏",
        address: "0xd93460f0ac2a4581c68f77f757a087662b10c3f2",
        balance: 0,
        count: 10,
        max: 22,
        min: 10,
        postValue: 0,   //玩家下注的钱
        AllBalance: AllBalance,
        cardSelfValue: cardSelfValue,
        cardOtherValue: cardOtherValue,
        btn: btn,

        clazzOther: clazzOther,
        clazzSelf: clazzSelf,
      }
    },
    components: {
      card: card,
      cardBack: cardBack
    },
    methods: {
      /**
       * 玩家登录  d93460f0ac2a4581c68f77f757a087662b10c3f2
       */
      login: function () {
        let address = $(".address").val();
        if (address.trim().length == 40) {
          //同步addres到本地
          sessionStorage.setItem("address", address);
          //同步address到服务器
          ws.send(JSON.stringify({status: 100, address: address, index: self.index}));
          //前端UI显示
          this.address = address;
          $(".panel-login").css({
            display: "none"
          });
          $(".panel-info").css({
            display: "block"
          });
        }
        return false;
      },
      /**
       * 开始游戏
       */
      startGame: function () {
        //如果游戏未开始，并且玩家已经登录
        if (this.btn[0] && sessionStorage.getItem("address") != null) {
          if (this.startMsg == "开始游戏") {
            this.startMsg = "退出游戏";
            this.btn.map((value, index) => {
              this.btn[index] = true;
            });
          } else {
            this.startMsg = "开始游戏";
            this.btn.map((value, index) => {
              if (index != 0) {
                this.btn[index] = false;
              }
            });
          }
          //开始游戏后 在游戏结束之前 禁止玩家点击结束游戏;
          this.btn=[false, false, false, false, false];
          //请求服务器初始化最初的2张牌
          ws.send(JSON.stringify({status: 102, playIndex: self.playIndex}));
        }
      },
      /**
       *退出游戏
       */
      logout:function(){
        this.btn = [true, false, false, false, false];
      },
      /**
       * 游戏认输
       */
      giveUp: function () {
        if (this.btn[2]) {
          let address = sessionStorage.getItem("address");
          if (address) {
            ws.sendText(JSON.stringify({status: 110, homeIndex: self.homeIndex, address: address}));
          }
        }
      },
      /**
       * status 103
       * 分发纸牌
       *   条件this.btn[1]==true
       */
      giveCard: function () {
        //允许发牌
        if (this.btn[1]) {
          ws.sendText(JSON.stringify({status: 103, homeIndex: self.homeIndex, playIndex: self.playIndex}));
          this.btn[1] = false;
        }
      },
      /**
       *玩家下注 104
       */
      postValue() {
        let address = sessionStorage.getItem("address")
        if (address && parseInt(this.postValue) > 0 && this.btn[4]) {
          //对手已经下注 轮到玩家下注
          if (opssite != 0 && this.postValue >= opssite) {

          } else {
            AllBalance += parseFloat(this.postValue); //增加余额
            //某个房间的玩家 下注多少
            ws.sendText(JSON.stringify({
              status: 104,
              homeIndex: self.homeIndex,
              address: address,
              value: this.postValue
            }));
            btn[4] = false;
            btn[3] = false;
          }
        }
      }
    }
  }
  $(function () {
    if (sessionStorage.getItem("address")) {
      sessionStorage.removeItem("address");
    }
    //退出登录
    $('.btn-logout').click(() => {
      //修改按钮点击
      btn = [true, false, false, false, false];
      console.log(btn);
      //清除本地连接
      sessionStorage.removeItem("address");
      //清除服务器连接
      ws.send(JSON.stringify({status: 101, index: self.index}));
      $(".panel-login").css({
        display: "block"
      });
      $(".panel-info").css({
        display: "none"
      });
    });
  });
</script>
<style scoped>
  @keyframes bs {
    0% {
      box-shadow: inset -1px 1px 3px 2px #444444, inset 1px -1px 3px 2px #222222, 0 0 0px 0 #b2ff1a;
    }

    50% {
      box-shadow: inset -1px 1px 3px 2px #444444, inset 1px -1px 3px 2px #222222, 0 0 20px 0 #1affff;
    }

    100% {
      box-shadow: inset -1px 1px 3px 2px #444444, inset 1px -1px 3px 2px #222222, 0 0 0px 0 #b2ff1a;
    }
  }
  .btn-control>input{
    padding: 8px;
    width: 100px;
    height: 30px;
    border-radius: 20px;
    animation: bs linear 2s 0s infinite;
    color:whitesmoke;
  }

  .panel {
    margin-left: 20px;
    color: #ccc;
    border: none;
    margin-top: 100px;
    width: 20%;
    position: absolute;
    box-shadow: 5px 5px 20px 2px #222222;
  }

  .panel-login {
    width: 25%;
  }

  hr {
    border: 0.5px solid #3C3F41;
  }

  .panel-heading {
    background: #3C3F41;
  }

  .panel-body {
    background: #2B2B2B;
  }

  .panel span {
    font-size: 16px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
  }

  .info:hover {
    color: #3F74BA;
  }

  form {
    color: #ccc;
  }

  input {
    background: #252525;
    border: 1px solid #2B2B2B;
    border-top-right-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
    outline: #2B2B2B;
    border-left: none;
  }

  .input-group-addon {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    background: #252525;
    border: none;
  }

  .pass {
    border-radius: 10px !important;
  }

  label {
    padding-right: 0px;
    line-height: 34px;
  }

  button {
    color: whitesmoke;
    background: transparent;
    outline: none;
    border: none;
  }

  .game {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 100px;
    margin: auto;
  }

  .game-sence {
    position: relative;
    background: #333333 url('../assets/classy_fabric.png') 0 0;
    margin-top: 60px;
    width: 800px;
    height: 450px;
    box-shadow: inset 0px 0px 2px rgba(0, 0, 0, 0.6);
  }

  .btn-control {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .anima {
    animation: bs linear 2s 0s infinite;
  }

  .btn-control button {
    outline: none;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background: #333333;
  }

  .game-other, .game-self {
    list-style: none;
    position: absolute;
  }

  .game-other {
    top: 10px;
    right: 10px;
  }

  .game-self {
    bottom: 10px;
    left: 10px;
  }

  li {
    width: 75px;
    height: 110px;
    margin: 0px 8px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  .game-other li {
    float: right;
  }
  .game-self li {
    float: left;
  }
  .mark {
    text-align: center;
    line-height: 100px;
    width: 200px;
    height: 100px;
    background: rgba(0, 0, 0, 0);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 50px;
    box-shadow: inset 0px 0px 8px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .mark p {
    font-weight: 800;
    color: #CDBA96;
    font-size: 22px;
  }

  .allCard {
    width: 75px;
    height: 110px;
    position: absolute;
    top: 20%;
    margin: auto 10px;
  }

  .no-card {
    display: none;
  }
</style>
