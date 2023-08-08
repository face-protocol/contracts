import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-spdx-license-identifier";
import "solidity-coverage";
import "hardhat-deploy";
import "hardhat-dependency-compiler";
import "./tasks";

dotenv.config();

const networkConfig = (url: string | null | undefined, verifyKey?: string) => ({
    url: url || "",
    accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    verify: {
        etherscan: {
            apiKey: verifyKey ?? "",
        },
    },
});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
    networks: {
        hardhat: {
            forking: process.env.FORKING_RPC_URL
                ? {
                      url: process.env.FORKING_RPC_URL,
                      blockNumber: 14791509,
                  }
                : undefined,
        },
        mainnet: networkConfig(
            `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            process.env.ETHSCAN_API_KEY
        ),
        goerli: networkConfig(
            `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            process.env.ETHSCAN_API_KEY
        ),
        mumbai: networkConfig(
            `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            process.env.POLYGONSCAN_API_KEY
        ),
        polygon: networkConfig(
            `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            process.env.POLYGONSCAN_API_KEY
        ),
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
    spdxLicenseIdentifier: {
        overwrite: true,
        runOnCompile: true,
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHSCAN_API_KEY || "",
            goerli: process.env.ETHSCAN_API_KEY || "",
            polygon: process.env.POLYGONSCAN_API_KEY || "",
            mumbai: process.env.POLYGONSCAN_API_KEY || "",
        },
        customChains: [
            {
                network: "mumbai",
                chainId: 80001,
                urls: {
                    apiURL: "https://api-testnet.polygonscan.com/api",
                    browserURL: "https://mumbai.polygonscan.com/",
                },
            },
        ],
    },
};

export default config;
