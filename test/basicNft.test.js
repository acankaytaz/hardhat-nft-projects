const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("BasicNft basic unit tests", function () {
          let basicNft, deployer

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["mocks", "basicNft"])
              basicNft = await ethers.getContract("BasicNft")
          })

          describe("constructor test", () => {
              it("checking name and symbol also couner at 0", async () => {
                  const tokenName = await basicNft.name()
                  const tokenSymbol = await basicNft.symbol()
                  const tokenCounter = await basicNft.getTokenCounter()
                  // now we'll compare
                  assert.equal(tokenName, "Dogo")
                  assert.equal(tokenSymbol, "WOF")
                  assert.equal(tokenCounter.toString(), "0")
              })
          })

          describe("mint nft test", () => {
              it("mints once then checks counter and tokenUri", async () => {
                  // mint one time and check token counter
                  const tx = await basicNft.mintNft()
                  await tx.wait(1)
                  const tokenCounter = await basicNft.getTokenCounter()
                  assert.equal(tokenCounter.toString(), "1")

                  // don't forget to compare URI
                  const uri = await basicNft.tokenURI(0) // it's the first uri here
                  assert.equal(uri, await basicNft.TOKEN_URI())
              })
          })
      })
