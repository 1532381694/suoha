const ws=require('nodejs-websocket')
const model=require('./model')
const Card=model.Card
const Player=model.Player
const Home=model.Home

//保存所有连接
let ConnectionArray=[];

//游戏房间 最多1024个房间
let HomeArray=new Array(1024);

//玩家连接池
let playConnArr=[];

//玩家就绪池
let playStartArr=[];
let allCount=0;

let server=ws.createServer(conn=>{
  conn.on("text",str=>{
    let msgObj=JSON.parse(str);
    switch (msgObj.status) {
      //增加一个玩家
      case 100:
        let realConnection=ConnectionArray[msgObj.index];
        let address=msgObj.address;
        let playIndex=createPlayer(realConnection,address);
        realConnection.sendText(JSON.stringify({status:201,playIndex:playIndex}))
        break;
      //删除一个玩家的地址
      case 101:
        ConnectionArray.splice(msgObj.index,1);
        break;
      //玩家请求游戏开始
      case 102:
        startGame(msgObj.playIndex)
        break;
      //玩家请求发牌
      case 103:
        sendCard(HomeArray[msgObj.homeIndex],playConnArr[msgObj.playIndex]);
        break;
      //接受到玩家下注
      case 104:
        postMoney(msgObj.homeIndex,msgObj.address,msgObj.value);
        break;
      case 110:
        giveUp(msgObj.homeIndex,msgObj.address)
        break;
    }
  });
  conn.on("close",(code,reason)=>{
    console.log("Connection have closed"+code+reason);
  });
  conn.on("error",(code,reason)=>{
    console.log("Connection Have Error" + code + reason);
  });
}).listen(8001);


/**
 * 每产生一个客户端连接
 * 1、全局连接加1
 * 2、将连接对象加入连接池
 * 3、回执客户端消息，告诉客户端它在服务器中的位置
 */
server.on("connection",(client)=>{
  ConnectionArray.push(client);
  client.sendText(JSON.stringify({status:200,index:allCount}));
  allCount++;
})

/**
 * status 100
 * 创建一个用户
 * 1、为玩家的socket连接赋值
 * 2、将玩家加入到玩家连接池中
 * @param realConnection
 * @param address
 * 返回玩家在连接池中的位置
 */
function createPlayer(realConnection,address){
  if(address!=null && realConnection!=null){
    let player=new Player(address);
    player.conn=realConnection;
    return (playConnArr.push(player)-1);
  }
}

/**
 * 游戏开始
 * 1、匹配玩家
 *    1.1在就绪连接池中找一个可连接对象
 *    1.2创建一个房间 将2个玩家加入房间
 *    1.3 如果就绪连接池为null，将玩家加入就绪池中
 * 2、向玩家发送2张牌
 * @param playerIndex
 * @param playerAddr
 */
function startGame(playerIndex){
  //从连接池中将玩家信息取出
  let playerOne=playConnArr[playerIndex];
  if(playerOne.play){
    return;
  }
  if(playStartArr.length!=0){
    let playerTwo=playStartArr.shift();
    playerTwo.play=true;
    playerOne.play=true;
    //创建房间
    let home=new Home(playerOne,playerTwo);
    let homeIndex=0;
    //查找服务端可用房间
    for(let i of HomeArray){
      if(i!=undefined){
        homeIndex++;
      }else{
        //创建的房间放入房间池中
        HomeArray[homeIndex]=home;
        break;
      }
    }
    //玩家互相通告对手是谁 之后再发牌
    playerOne.conn.sendText(JSON.stringify({status:203,address:playerTwo.address,homeIndex:homeIndex}),()=>{
      playerTwo.conn.sendText(JSON.stringify({status:203,address:playerOne.address,homeIndex: homeIndex}),()=>{
        //改玩家发起游戏
        initGame(home,playerOne);
      });
    });

  }else{
    playStartArr.push(playerOne);
  }
}

/**
 * 初始化游戏参数:玩家手牌
 * 调用区块链中初始化房间的函数
 * 返回值对象{status:202,address:address,card:card}
 * address 该牌发送给谁
 * card  牌的具体对象
 */
function initGame(home,player){
  /**
   * 从区块链中取出10张牌
   */
  sendCard(home,player)
}

/**
 * 某个房间的某个玩家发起发牌指令
 * @param home
 * @param player
 */
function sendCard(home,player){
  let round=home.round;
  let playerOne;
  let playerTwo;
  if(player.address==home.playOne.address){
    playerOne=home.playOne.address;
    playerTwo=home.playTwo.address;
  }else{
    playerOne=home.playTwo.address;
    playerTwo=home.playOne.address;
  }
  playerOne.sendText(JSON.stringify({status:202,card:home.card[round*2],address:playerOne.address,round:round}));
  playerOne.sendText(JSON.stringify({status:202,card:home.card[round*2+1],address:playerTwo.address,round:round}));

  playerTwo.sendText(JSON.stringify({status:202,card:home.card[round*2],address:playerOne.address,round:round}));
  playerTwo.sendText(JSON.stringify({status:202,card:home.card[round*2+1],address:playerTwo.address,round:round}));
  home.round++;
}

/**
 * 玩家认输
 * index 房间号
 * address 认输玩家的地址
 */
function giveUp(index,address){
  let home=HomeArray[index];
  if(home.playOne.address==address){
    /**
     * 玩家一认输
     * 1、通告对手游戏结束
     */
    home.playTwo.sendText(JSON.stringify({status:204,win:true}));
  }else{
    /**
     * 玩家二认输
     */
    home.playOne.sendText(JSON.stringify({status:204,win:true}));
  }
  //游戏结束 修改玩家状态标志
  home.playOne.play=false;
  home.playTwo.play=false;
  //销毁房间
  HomeArray[index]=undefined;
}

/**
 * 收到玩家下注的信息
 * @param homeIndex
 * @param address
 * @param value
 */
function postMoney(homeIndex,address,value){
  /**
   * 向区块链发送转账信息
   */
  let home=HomeArray[homeIndex]
  if(home.playOne.address==address){
    home.playTwo.conn.sendText(JSON.stringify({status:204,value:value}));
  }else{
    home.playOne.conn.sendText(JSON.stringify({status:204,value:value}));
  }
}

/**
 * 根据去区块链中的数据返回具体的牌
 * @param num
 * @returns {module.exports.Card}
 */
function getCard(num){
  let value=num%100;
  let kind=parseInt(num/100);

  switch(kind){
    case 0:
      kind='suitBlock';
      break;
    case 1:
      kind="suitClub";
      break;
    case 2:
      kind="suitHeart";
      break;
    case 3:
      kind="suitSpade";
      break;
  }
  switch(value){
    case 11:
      value='J';
      break;
    case 12:
      value="Q";
      break;
    case 13:
      value="K";
      break;
  }
  value=value+'';
  return new Card(value,kind);

}
