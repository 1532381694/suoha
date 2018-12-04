pragma solidity ^0.4.24;
//扑克牌(梭哈)
contract Carding{
     struct User{
         address other;  //其他玩家的地址
         string[5] card; //自己的手牌
         uint spend;  //自己投了多少钱
         uint total;   //奖池总共金额
     }     
  
  mapping(address=>User) user;  //玩家地址映射玩家对象
      
    // uint[4] color;
    // uint[13] point;
    uint[52]cards=[102,103,104,105,106,107,108,109,110,111,112,113,114,202,203,204,205,206,207,208,209,210,211,212,213,214,
          302,303,304,305,306,307,308,309,310,311,312,313,314,402,403,404,405,406,407,408,409,410,411,412,413,414];
 
   
   
    uint public randNonce = 0;
    uint public random;
    uint[10]  newCard;
     function rand()public{
        for(uint8 i=0;i<10;i++){
         random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 52;
           // randomcard[randNonce]=cards[random];
            newCard[i]=cards[random];
           randNonce++;
        //  uint random2 = uint(keccak256(now, msg.sender, randNonce)) % 100;
        }
       
    }
    function getnewcard() public view returns(uint[10]) {
      return newCard;
    }
  
   
}
