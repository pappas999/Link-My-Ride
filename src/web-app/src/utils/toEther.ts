import Web3 from "web3"

export const toEther = (wei: number) => {
    return Web3.utils.fromWei(wei.toString(), 'ether')
}