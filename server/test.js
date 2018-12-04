
const Map=require('./model').Mapping
function getMaxRange(arr1,arr2){
  let obj1={};
  let obj2={};
  for(let value in arr1){
    if(obj1[arr1[value]]){
      obj1[arr1[value]]++;
    }else{
      obj1[arr1[value]]=1;
    }
  }
  for(let value in arr2){
    if(obj2[arr2[value]]){
      obj2[arr2[value]]++;
    }else{
      obj2[arr2[value]]=1;
    }
  }
  let key1='0'
  let count1=0;
  let key2='0'
  let count2=0;

  /**
   * 找出出现次数最多的扑克
   */
  Object.keys(obj1).forEach((key)=>{

    if(obj1[key]>=count1){
      //出现次数一样 但是点数大
      if(Map[key]>Map[key1] && obj1[key]==count1){
        key1=key;
      }else if(obj1[key]>obj1[key1]){  //出现
        key1=key;
        count1=obj1[key];
      }
    }
    if(obj1[key1]==undefined){
      key1=key;
      count1=obj1[key];
    }
  });
  Object.keys(obj2).forEach((key)=>{
    if(obj2[key]>=count2){
      //出现次数一样 但是点数大
      if(Map[key]>Map[key2] && obj2[key]==count2){
        key2=key;
      }else if(obj2[key]>obj2[key2]){  //出现
        key2=key;
        count2=obj2[key];
      }
    }
    if(obj2[key2]==undefined){
      key2=key;
      count2=obj2[key];
    }
  });
  console.log(key1+":"+count1);
  console.log(key2+":"+count2);


  if(count1>count2){
    return 1;
  }else if(count1==count2 && Map[key1]>Map[key2]){
    return 1;
  }else if(count1==count2 && Map[key1]==Map[key2]){
    delete obj1[key1]
    delete obj2[key2]
    if(isEmpty(obj1) && isEmpty(obj2)){
      return 0
    }else{
      let newArr1=[];
      let newArr2=[];
      Object.keys(obj1).forEach((key)=>{
        for(let i=0;i<obj1[key];i++){
          newArr1.push(key);
        }
      });
      Object.keys(obj2).forEach((key)=>{
        for(let i=0;i<obj2[key];i++){
          newArr2.push(key);
        }
      })
      return getMaxRange(newArr1,newArr2);
    }
  }else{
    return 2
  }
}
function isEmpty(obj){
  for(let name in obj){
    return false;
  }
  return true;
}
let arr1=['3','3','4','4','A']
let arr2=['2','2','4','4','Q']
console.log(getMaxRange(arr1, arr2));

