import { ethers } from "hardhat";
import { HardhatUserConfig } from "hardhat/types";



// 在部署脚本中添加调试信息
async function main() {
  const QiushiToken = await ethers.getContractFactory("QiushiToken");
  const qiushiToken = await QiushiToken.deploy();
  await qiushiToken.deployed();
  console.log(`QiushiToken deployed to ${qiushiToken.address}`);

  // 打印账户余额和 Gas 费用
  const accounts = await ethers.getSigners();
  const account = accounts[0];
  const balance = await account.getBalance();
  console.log(`Account balance: ${balance.toString()}`);

  
  const BorrowYourCar = await ethers.getContractFactory("BorrowYourCar");
  const borrowYourCar = await BorrowYourCar.deploy(qiushiToken.address, { gasPrice: 20000000000 }); // 设置 gas 价格
  await borrowYourCar.deployed();
  console.log(`BorrowYourCar deployed to ${borrowYourCar.address}`);
  // 打印账户 Gas 价格和估算的燃料费
console.log(`Gas price: ${await ethers.provider.getGasPrice()}`);
const estimateGas = await borrowYourCar.estimateGas.getAvailableCars(); // 替换为你实际的合约方法
console.log(`Estimated gas cost: ${estimateGas.toString()}`);
// 打印 UNKNOWN 代币余额
const unknownBalance = await qiushiToken.balanceOf(account.address);
console.log(`Account UNKNOWN balance: ${unknownBalance.toString()}`);


}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export const config: HardhatUserConfig = {
  // ... 其他配置 ...
  solidity: {
    version: "0.8.20", // 或者你 Solidity 文件中使用的版本
    // ... 其他配置 ...
  },

  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        '0x78fe3f9c0f82c29032f068f8d250a937c268f740731c9695b641a234647d7caa',
        '0x0f0d6cacea32be3d991201314b25ab5319523786adc2ead021403a942b041c83',
        '0x94ece0a044b733e69dff1e17193a7e47821ebe9bfcd95bbfe1aa320e1ef7938f',
        '0x17879db66726ec0192aa6ad8184a8ba5b36c97d64f9e51054d3acf7757880050',
        '0x425fecb81e15511070059d698fdc6dfa5e3995f44e20a1f6678f5230b39442de',
        '0xb5c301b544a17659cdbbc5cec8c8a7b9bc28f0dae98d98eb5229c2feaa5bdae0',
        '0xdbb3ef59d426c845e64689f73a76408550b487b0df5ba275be4c1d1222547ab2',
        '0x881b2aa57ef7c7753edb62d02bbb7433a83703444bd8753855ee23b30702ddc0',
        '0x85e07c5052ef54409ebf375afd2635057fe3a1520bfeffd7d5c6f46a4d7ee088',
        '0xdbb494655fb865b089b574270c072d328f66b98b96eeb76a6abe577b3f7231fa',
      ],
      gas: 6000000,  // 设置 gas 限制，根据需要调整
      gasPrice: 20000000000,  // 设置 gas 价格，根据需要调整
    },
  },
};
