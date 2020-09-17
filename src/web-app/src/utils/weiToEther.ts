import Web3 from "web3"

export const weiToEther = (wei: number) => {
    return Web3.utils.fromWei(wei.toString(), 'ether')
}