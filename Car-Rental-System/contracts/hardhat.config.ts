import '@babel/register';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
// 导入 ethers 库
import { ethers } from "hardhat";

// 定义 deploy 任务
import * as path from 'path';


// 确保这里的 HardhatUserConfig 类型包含 scripts 字段
interface MyHardhatConfig extends HardhatUserConfig {
  scripts: {
    deploy: string;
  };


}


const config: MyHardhatConfig = {
  // ...其他配置
  solidity: {
    version: "0.8.20", // 确保这个版本与你的合约中声明的版本一致
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    ganache: {
      url: "http://localhost:8545", // 请根据实际情况修改端口号
      // ...其他配置
      accounts: [
        '0xeC4e48F5cE8E9E0B74A5c72b4ef9EF65D567Fd9E',

      ],

    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [
        '0xeC4e48F5cE8E9E0B74A5c72b4ef9EF65D567Fd9E',

      
      ],
      gas: "auto",
      gasPrice: "auto",

    },
  },
  scripts: {
    deploy: './contracts/scripts/deploy.ts',
  },
  

};

export default config;