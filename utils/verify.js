const { run } = require("hardhat")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract... 3 2 1...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("This contract already verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
