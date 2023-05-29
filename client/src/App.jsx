import { useContext, useEffect, useState } from 'react'
import './App.css'
import { TransactionContext } from './context/transactionContext'

function App() {

  const { sendTransaction, transactions, connectWallet, currentAccount } = useContext(TransactionContext)
  const [selectedReq, setSelectedReq] = useState()

  const handleSendTransactions = async () => {
    console.log(selectedReq)
    const transactionData = {
      selectedReq: selectedReq
    };
    await sendTransaction(transactionData)
  }

  return (
    <div className='aid'>
      <select name="" id="" defaultValue={"Lütfen Seçim Yapınız"} onChange={e => setSelectedReq(e.target.value)}>
        <option disabled value={"Lütfen Seçim Yapınız"}>
          Lütfen Seçim Yapınız
        </option>
        <option value="Isınma">Isınma</option>
        <option value="Yiyecek" >Yiyecek</option>
        <option value="Kıyafet" >Kıyafet</option>
      </select>

      <button onClick={handleSendTransactions}>Ağa Yaz</button>

      {
        !currentAccount &&
        <button onClick={connectWallet}>Cüzdanı Bağla</button>
      }

      <div>
        {
          transactions.map((transaction, key) => (
            <p key={key}>{transaction.message}</p>
          ))
        }
      </div>
    </div>
  )
}

export default App
