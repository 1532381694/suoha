module.exports={
  Player:function(address){
    this.address=address;   //玩家地址
    this.play=false;        //是否在游戏中
    this.cardArr=[];        //玩家手牌
    this.conn=null;         //玩家远程套接字
  },
  Card:function(value,kind){
      this.value=value;     //牌的值
      this.kind=kind;       //牌的类型
  },
  Home:function(playOne,playTwo){
    this.playOne=playOne;   //玩家一
    this.playTwo=playTwo;   //玩家二
    this.round=0;           //当前房间回合数
    this.card=new Array(10);//当前房间的所有牌
  },
  Mapping:{
    'A':13,
    'K':12,
    'Q':11,
    'J':10,
    '10':9,
    '9':8,
    '8':7,
    '7':6,
    '6':5,
    '5':4,
    '4':3,
    '3':2,
    '2':1
  }
}
