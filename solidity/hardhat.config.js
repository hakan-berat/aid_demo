require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.7',
  networks: {
    sepolia: {
      url: 'https://sepolia.infura.io/v3/7bb22745e31f435c93a8debed62ff562',
      accounts: ['4cad817ae173ceefc5304fe07844c32fb4f590bf585f7c793c52a9e8fb314f3c'],
    },
  },
};
