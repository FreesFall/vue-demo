<template>
  <div>
      <button v-on:click="connectBscMetamask">连接BSC</button>
      <button v-on:click="connectEthMetamask">连接ETH</button>
       <div>当前钱包地址：{{currentAddress}}</div> 
      <br/>
      <button v-on:click="approve">授权</button>
      <br/>
      <div>授权的数量:{{AllowanceBalance}}</div> 
       <br/>
      <button v-on:click="TransformAToken">转账</button>

      <br/>
      <button v-on:click="RemoveApprove">取消授权</button>
  </div>  
 
</template>

<script>

import Web3 from 'web3'
import BigNumber from "bignumber.js";
// erc20 的abi
import erc20 from './abi/erc20.json'
// tranferContract 的abi
import tranferContractAbi from './abi/tranferContract.json'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  
  data(){
      return {
        // ERC20 usdt 侧链地址
        Atoken:"0x110a13FC3efE6A245B50102D2d79B3E76125Ae83",
        //需要转账2个地址目标数组
        targetAddress:["0xFe6D7AA43Eff1F31167320bD13898B97CCbddF03","0x16C592D92d83d8EfcD9D206eab99579ae7B98e7E"],
        //需要转账2个地址目标数量
        targetAmount:["1","2"],
        // 需要转移的token精度 这里是转的Token 的精度 比如 USDT
        decimals:6,
        // 当前钱包地址
        currentAddress:"",
        // 授权数量
        AllowanceBalance:0,
        //web3 实例
        web3:null
      }
  },
  methods:{
     //连接BSC钱包
     async connectBscMetamask() {
          if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
            // 检测到Web3浏览器用户。 现在可以使用提供程序了。
            const provider = window['ethereum'] || window.web3.currentProvider;
            // 实例化web3
            //挂载在全局变量，方便直接获取
            this.web3= new Web3(provider);

            // 切换网络，网络不存在，添加网络
            const chainId = (56).toString(16);
            try {
              // 切换网络
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: `0x${chainId}`}]
              })
            } catch (error) {
              //无网络BSC添加网络
              if ((error).code === 4902) {
                  if (provider) {
                    // bch chainId 10000 转 16进制
                    
                    try {
                      await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                          {
                            chainId: `0x${chainId}`,
                            chainName: 'Binance Smart Chain',
                            nativeCurrency: {
                              name: 'BNB',
                              symbol: 'BNB',
                              decimals: 18,
                            },
                            rpcUrls: ["https://bsc-dataseed4.binance.org/"],
                            blockExplorerUrls: [`https://explorer.binance.org/smart/`],
                          },
                        ],
                      })
                      return true
                    } catch (error) {
                      console.error('Failed to setup the network in Metamask:', error)
                      return false
                    }
                    } else {
                    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
                    return false
                  }
              }
            }

            window.ethereum.enable().then((res) => {
                        this.currentAddress=res[0];
                        console.log("当前钱包地址：" + res)
            })
          }else {
            alert("请安装MetaMask钱包")
          }
     },
     //连接ETH钱包
     async connectEthMetamask() {
          if (typeof window.ethereum !== 'undefined'|| (typeof window.web3 !== 'undefined')) {
            // 检测到Web3浏览器用户。 现在可以使用提供程序了。
            const provider = window['ethereum'] || window.web3.currentProvider;
            // 实例化web3
            //挂载在全局变量，方便直接获取
            this.web3= new Web3(provider);

            // 切换网络，网络不存在，添加网络
            const chainId = (1).toString(16);
            try {
              // 切换网络
              await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: `0x${chainId}`}]
              })
            } catch (error) {
              //无网络BSC添加网络
              if ((error).code === 4902) {
                  if (provider) {
                    // bch chainId 10000 转 16进制
                    
                    try {
                      await provider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                          {
                            chainId: `0x${chainId}`,
                            chainName: 'Ethereum Mainnet',
                            nativeCurrency: {
                              name: 'ETH',
                              symbol: 'ETH',
                              decimals: 18,
                            },
                            rpcUrls: ["https://cloudflare-eth.com/"],
                            blockExplorerUrls: [`https://etherscan.io/`],
                          },
                        ],
                      })
                      return true
                    } catch (error) {
                      console.error('Failed to setup the network in Metamask:', error)
                      return false
                    }
                    } else {
                    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
                    return false
                  }
              }
            }

            window.ethereum.enable().then((res) => {
                        this.currentAddress=res[0];
                        console.log("当前钱包地址：" + res)
            })
          }else {
            alert("请安装MetaMask钱包")
          }
     },
     //授权
     async approve(){
        // web3js API 连接合约，获取实例 参数 erc20 abi,和合约地址
        const contract =new this.web3.eth.Contract(erc20, "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83");
        // erc20标准 approve 参数 被授权地址(这里指B合约地址)，当前用户授权的数量
        try{
          const res=await contract.methods.approve("0x5566459Acb1DCC6619F73b57E7c5A950634B083f","115792089237316195423570985008687907853269984665640564039457584007913129639935")
          .send({from:this.currentAddress});

          alert("授权成功")
          console.log("授权成功",res)
          this.getAllowanceBalance();
        }catch(e){
          alert("授权失败")
        }
     },
     //取消授权
     async RemoveApprove(){
        // web3js API 连接合约，获取实例 参数 erc20 abi,和合约地址
        const contract =new this.web3.eth.Contract(erc20, "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83");
        // erc20标准 approve 参数 被授权地址(这里指B合约地址)，当前用户授权的数量
        try{
          const res=await contract.methods.approve("0x5566459Acb1DCC6619F73b57E7c5A950634B083f","0")
          .send({from:this.currentAddress});

          alert("取消授权成功")
          console.log("取消授权成功",res)
          this.getAllowanceBalance();
        }catch(e){
          alert("取消授权失败")
        }
     },
     //通过我们自定义合约转账
     async TransformAToken(){
         // 注意这里是通过我们的合约进行转悠，所以初始化，ABI 就是我们合约编译的Abi
         //参数 tranferContractAbi ABI, tranferContractAbi address
         const contract = new this.web3.eth.Contract(tranferContractAbi, "0x5566459Acb1DCC6619F73b57E7c5A950634B083f");
         // erc20标准 approve 参数 授权地址，被授权地址(这里指B合约地址)
         try{
           // 参数 目标ECR20 代币地址,to address,两个地址分别转多少token[1,2]
           const amountValue=[
             new BigNumber(this.targetAmount[0]).times(new BigNumber(10).pow(this.decimals)).toFixed(0),
             new BigNumber(this.targetAmount[1]).times(new BigNumber(10).pow(this.decimals)).toFixed(0)
           ]
           
           const res=await contract.methods.transferFuc(this.Atoken,this.targetAddress,amountValue)
           .send({from:this.currentAddress});

           console.log("hash:",res)
           alert("转账成功")
         }catch(e){
           alert("转账失败")
         }
     },
     //查询授权地址 给我们合约的余额
     async getAllowanceBalance(){
        // web3js API 连接合约，获取实例 参数 erc20 abi,和合约地址
        const contract = new this.web3.eth.Contract(erc20, "0x110a13FC3efE6A245B50102D2d79B3E76125Ae83");
        // erc20标准 approve 参数 授权地址，被授权地址(这里指B合约地址)
        try{
          const res=await contract.methods.allowance(this.currentAddress,"0x5566459Acb1DCC6619F73b57E7c5A950634B083f").call();
          this.AllowanceBalance=res;
          console.log("授权的余额:",res)
        }catch(e){
          alert("失败")
        }
     },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
