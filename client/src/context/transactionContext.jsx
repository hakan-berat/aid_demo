import React from "react"
import { ethers } from "ethers"

import { createContext, useEffect, useState } from "react"

import { contractABI, contractAddress } from '../utils/constants.js'

export const TransactionContext = createContext()

const { ethereum } = window

const createEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer)

    return transactionsContract;
};

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    const checkIfWalletIsConnect = async () => {
        try {
            // if (!ethereum) return alert("Please install MetaMask.");

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Lütfen Metamask eklentisini yükleyin");

            const accounts = await ethereum.request({ method: "eth_requestAccounts", });

            //Bağlanan cüzdanın adresini çeker bu büyük bir hareket kabiliyeti kazandırıyor. Herhangi bir
            //cüzdanın kime ait olduğunu kontrol edebiliriz
            setCurrentAccount(accounts[0]);
            window.location.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object");
        }
    };

    const sendTransaction = async (transactionData) => {
        try {
            if (ethereum) {
                const amount = '0.0000001';
                const transactionsContract = await createEthereumContract();
                const {selectedReq} = transactionData
                console.log(transactionData)
                const parsedAmount = ethers.utils.parseEther(amount);

                await ethereum.request({
                    method: "eth_sendTransaction",
                    params: [{
                        from: currentAccount,
                        to: "0x4f2828C559e521B2d47A9d1D72397c3Bd70Be399",
                        gas: "0x5208", //GWEI
                        value: parsedAmount._hex,
                    }],
                });

                const transactionHash = await transactionsContract.addToBlockchain("0x4f2828C559e521B2d47A9d1D72397c3Bd70Be399", parsedAmount, selectedReq);

                setIsLoading(true);
                console.log(`Loading - ${transactionHash.hash}`);
                await transactionHash.wait();
                console.log(`Success - ${transactionHash.hash}`);


                setIsLoading(false);
                window.location.reload();
            } else {
                console.log("No ethereum object");
            }
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnect()
    }, [currentAccount])

    const getAllTransactions = async () => {
        try {
            if (ethereum) {
                const transactionsContract = await createEthereumContract();

                const availableTransactions = await transactionsContract.getAllTransactions();

                const structuredTransactions = availableTransactions.map((transaction) => ({
                    addressTo: transaction.receiver,
                    addressFrom: transaction.sender,
                    timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                    message: transaction.message,
                    amount: parseInt(transaction.amount._hex) / (10 ** 18)
                }));

                console.log(structuredTransactions);

                setTransactions(structuredTransactions);
            } else {
                console.log("Ethereum is not present");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, sendTransaction, transactions }}>
            {children}
        </TransactionContext.Provider>
    )
}

