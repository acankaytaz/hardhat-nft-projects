# NFTs

---

#### THIS CONTAINS 3 DIFFERENT TYPE OF CONTRACTS:

To install all needed dependencies:

-   `yarn add --dev hardhat@2.9.3`

-   `yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv`

1. ###### Basic NFT ERC-721

-   Using Openzepplin contract:
    -   `yarn add --dev @openzeppelin/contracts `

2. ###### RANDOM IPFS HOSTED NFT, hosted on IPFS
    Uses randomness to generate a unique NFT

-   We'll use ChainlinkVRF for randomness
-   Pros: Cheap
-   Cons: Someone needs to pin the data
-   `yarn add --dev @chainlink/contracts`
-   [Chainlink Get a Random Number Docs](https://docs.chain.link/docs/vrf/v2/subscription/examples/get-a-random-number/)
-   `requestNft()` function and `constructor()` function are same with docs minus additions.
-   We imported `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";` to use setToken function and we can still use ERC721 because ERC721URIStorage is an extension of ERC721.
-   Uploading own images to IPFS:
    -   pinata -> `yarn add --dev @pinata/sdk` also need path `yarn add --dev path`
    -   https://docs.pinata.cloud/pinata-api/pinning/update-metadata
    -   https://www.npmjs.com/package/@pinata/sdk#pinJSONToIPFS-anchor
    -   NOTE: When deploying to Goerli: `yarn hardhat deploy --network goerli --tags main `
        And then go to contracts etherscan page and copy contract address
        Then go to https://vrf.chain.link/goerli/ add that contract to Subscription's Consumers.

3. ###### DINAMIC SVG NFT, hosted fully on-chain
    Uses price feeds to be dynamic

-   Pros: All the data is on chain
-   Cons: A lot more expensive
-   If Eth price above certain price -> happy face, if not -> sad face
-   `yarn add --dev base64-sol`
-   We need to add Chainlink Price Feed:
    -   [Chainlink Price Feed Docs](https://docs.chain.link/docs/data-feeds/price-feeds/)
    -   `yarn add --dev @chainlink/contracts`

##### If you paste contracts address into testnets.opensea.io it will show the Collections, but it may take hours.

---

#### Other Usage:

-   Deploy: `yarn hardhat deploy`
-   Testing: `yarn hardhat test`
