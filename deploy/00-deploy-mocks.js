const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // 0.25 is the premium, it costs 0.25 per req
const GAS_PRICE_LINK = 1e9 // link per gas. calculated value based on gas price of the chain

const DECIMALS = "18"
const INITIAL_PRICE = ethers.utils.parseEther("2000", "ether")

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        // if we're in a development chain
        log("Local network detected!!!!! Beware! Deploying the mocky mocks...")
        // deploy a mock vrfcoordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        await deploy("MockV3Aggregator", {
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks deployed! Are u happy?")
        log("-----------------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
