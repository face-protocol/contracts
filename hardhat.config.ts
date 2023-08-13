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
                version: "0.8.21",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                    evmVersion: "paris",
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
        opGoerli: networkConfig(
            "https://goerli.optimism.io",
            process.env.OPTISCAN_API_KEY
        ),
        baseGoerli: networkConfig(
            "https://goerli.base.org",
            process.env.BASESCAN_API_KEY
        ),
        zoraGoerli: networkConfig(
            "https://testnet.rpc.zora.energy",
            process.env.ZORASCAN_API_KEY
        ),
        modeSepolia: networkConfig(
            "https://sepolia.mode.network/",
            process.env.MODESCAN_API_KEY
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
        customChains: [
            {
                network: "opGoerli",
                chainId: 420,
                urls: {
                    apiURL: "https://goerli-explorer.optimism.io/api",
                    browserURL: "https://goerli-explorer.optimism.io/",
                },
            },
            {
                network: "baseGoerli",
                chainId: 84531,
                urls: {
                    apiURL: "https://goerli.basescan.org/api",
                    browserURL: "https://goerli.basescan.org/",
                },
            },
            {
                network: "zoraGoerli",
                chainId: 999,
                urls: {
                    apiURL: "https://testnet.explorer.zora.energy/api",
                    browserURL: "https://testnet.explorer.zora.energy/",
                },
            },
            {
                network: "modeSepolia",
                chainId: 919,
                urls: {
                    apiURL: "https://sepolia.explorer.mode.network/api",
                    browserURL: "https://sepolia.explorer.mode.network/",
                },
            },
        ],
    },
};

export default config;
