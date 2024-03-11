import { useEffect, useState } from 'react';
import LineGraph from './LineGraph';
import './App.css';

function App() {

  const [eth, setEth] = useState({currentValue: 0, change: 0, color: ''})
  const [dots, setDots] = useState([])
  const [ethToDollar, setEthToDollar] = useState(0)
  const [dollarToEth ,setDollarToEth] = useState(0)
  const [convertToDollar, setConvertToDollar] = useState(0)
  const [convertToEth, setConvertToEth] = useState(0)

  useEffect(() => {
    const getData = async () => {
      try{  
        const res = await fetch('https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1')
        if(res.ok){
          const data = await res.json()
          const currentValue = data.prices[data.prices.length -1][1]
          const yesterday = data.prices[0][1]
          const change = ((currentValue - yesterday) / currentValue) * 100
          const color = change > 0 ? 'green' : 'red'

          let last_week = data.prices.slice(-7)
          last_week = last_week.map(day => day[1])

          setEth({currentValue: currentValue.toFixed(2), change: change.toFixed(2), color: color})
          setDots(last_week)
        } 
      }
      catch{
        console.log("Error!")
      }
    }
    
    getData()
  }, [])

  const handleConvertionToDollar = (e) => {
    setEthToDollar(e.target.value)
    setConvertToDollar((e.target.value * eth.currentValue).toFixed(2))
  }

  const handleConvertoinToEth = (e) => {
    setDollarToEth(e.target.value)
    setConvertToEth((e.target.value / eth.currentValue).toFixed(2))
  }

  return (
    <div className="App">
      <h1>ETH</h1>

      <div className='eth'>
        <p>${eth.currentValue} Dollars <span className='change' style={{ background: eth.color }}>{eth.change}%</span></p>
        <LineGraph dots={dots} />
      </div>
      
      <div className='convertor'>
        <label>Eth To Dollar</label>
        <input type='text' value={ethToDollar} onChange={handleConvertionToDollar} />
        <p>{convertToDollar}$</p>

        <label>Dollar To Eth</label>
        <input type='text' value={dollarToEth} onChange={handleConvertoinToEth} />
        <p>{convertToEth} ETH</p>
      </div>

    </div>
  );
}

export default App;