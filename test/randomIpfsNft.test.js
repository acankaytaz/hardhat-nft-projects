const { rejects } = require("assert")
const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { isCallTrace } = require("hardhat/internal/hardhat-network/stack-traces/message-trace")
const { resolve } = require("path")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("randomIpfsNft unit tests", function () {
          let randomIpfsNft, deployer, vrfCoordinatorV2Mock

          beforeEach(async () => {
              accounts = await ethers.getSigners()
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["mocks", "randomipfs"])
              randomIpfsNft = await ethers.getContract("RandomIpfsNft")
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("constructor test", () => {
              // dogTokenUris
              it("initialize uri in constructor before nftMint ", async () => {
                  const dogUriNumberZero = await randomIpfsNft.getDogTokenUris(0)
                  assert(dogUriNumberZero.includes("ipfs://"))
              })

              it("checking token name symbol", async () => {
                  const tokenName = await randomIpfsNft.name()
                  const tokenSymbol = await randomIpfsNft.symbol()
                  // now we'll compare
                  assert.equal(tokenName, "Random Ipfs Nft")
                  assert.equal(tokenSymbol, "RINFT")
              })
          })

          describe("requestNft function", () => {
              //to be reverted without payment
              it("no payment no nft", async () => {
                  await expect(randomIpfsNft.requestNft()).to.be.revertedWith(
                      "RandomIpfsNft__NeedMoreETHSent"
                  )
              })

              it("insufficient payment no nft", async () => {
                  const wantedPayment = await randomIpfsNft.getMintFee() // getting required mint price
                  const cuttingPayment = ethers.utils.parseEther("0.001")
                  const insufficientPayment = wantedPayment - cuttingPayment // getting lower than required payment
                  await expect(
                      randomIpfsNft.requestNft({ value: insufficientPayment })
                  ).to.be.revertedWith("RandomIpfsNft__NeedMoreETHSent")
              })
          })

          describe("fulfillrandomwords", () => {
              it("dog token uris initializes after minting correctly and token counter increases by one", async () => {
                  randomIpfsNft.once("NftMinted", async () => {
                      try {
                          const dogUri = await randomIpfsNft.getDogTokenUris(1)
                          const tokenCounter = await randomIpfsNft.getTokenCounter()
                          assert(dogUri.includes("ipfs://"))
                          assert.equal(tokenCounter, "1")
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
              it("mints nft ", async () => {
                  randomIpfsNft.once("NftMinted", async () => {
                      try {
                          const payment = await randomIpfsNft.getMintFee()
                          const tx = randomIpfsNft.requestNft({ value: payment })
                          const txReceipt = await tx.wait(1)
                          await vrfCoordinatorV2Mock.fulfillRandomWords(
                              requestNftReceipt.events[1].args.requestId,
                              randomIpfsNft.address
                          )
                      } catch (e) {
                          console.log(e)
                          reject(e)
                      }
                  })
              })
          })

          describe("random numbers(moddedRng) and expected dogos", () => {
              it("should return pug if it's < 10", async () => {
                  const expectedDogi = await randomIpfsNft.getBreedFromModdedRng(5)
                  assert.equal(0, expectedDogi) // 0 is pug
              })
              it("should return shiba if it's between 10-39", async () => {
                  const expectedDogi = await randomIpfsNft.getBreedFromModdedRng(31)
                  assert.equal(1, expectedDogi)
              })
              it("should return st bernard if it's between 40-99", async () => {
                  const expectedDogi = await randomIpfsNft.getBreedFromModdedRng(69)
                  assert.equal(2, expectedDogi)
              })
              it("should revert if number above expected > 99", async () => {
                  await expect(randomIpfsNft.getBreedFromModdedRng(100)).to.be.revertedWith(
                      "RandomIpfsNft__RangeOutOfBounds"
                  )
              })
          })
      })
