 s=10;
 const amounts=[[1,2,3,4,5,6,7,8,9,10],[1,2,3,4,5,6,7,8,9,10],[1,2,3,4,5,6,7,8,9,10]]
 const n = amounts.length;

 const  answer =  new Array(n).fill().map((d,i)=>[]); // int[n][s+1]
 const  parent = new Array(n).fill().map((d,i)=>[]); // int[n][s+1]

 for (let i = 0; i < n; i++) {
     //[[],[],[],[]]
     answer[i] = new Array(s+1).fill().map((d,i)=>'');
     //[[],[],[],[]]
     parent[i] = new Array(s+1).fill().map((d,i)=>'');
 }

 // 遍历100份s, 路径n=565个 二维数组，  9个交易所，一个交易所 65 个路径
 // 565种路径 除了565个数组的 第一项，都给赋值默认值 -1e72
 // amounts 第一项全部赋值给 answer;类似拷贝的方式,answer 其他赋值为-1e72
 for (let j = 0; j <= s; j++) {
     answer[0][j] = amounts[0][j];
     for (let i = 1; i < n; i++) {
         answer[i][j] = -1e72;
     }
     parent[0][j] = 0;
 }

 console.log("parent",parent)
 console.log("answer",answer)
 // parent  [[0,0,0,0,0,0,0,0,0,0],[],[],[]]
 //s=10,n=3 answer [[-1e72,-1e72,-1e72,-1e72,-1e72,-1e72,-1e72,-1e72,-1e72,-1e72],[],[],[]]

 // 遍历 路径n=565个 二维数组，  9个交易所，一个交易所 65 个路径
//  for (let i = 1; i < n; i++) {
//      //遍历 100份s
//      for (let j = 0; j <= s; j++) {
//          answer[i][j] = answer[i - 1][j];
//          parent[i][j] = j;

//          for (let k = 1; k <= j; k++) {
//              // answer[i=1 - 1][j=1 - k=1] + amounts[i=0][k=0]
//              // answer[0][0] + amounts[1][1]>answer[1][1]
//              // answer[1][1]=answer[0][0]+amounts[1][1]

//              if (answer[i - 1][j - k] + amounts[i][k] > answer[i][j]) {
//                  answer[i][j] = answer[i - 1][j - k] + amounts[i][k];
//                  parent[i][j] = j - k;
//              }
//          }
//      }
//  }

