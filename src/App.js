import { useEffect, useState } from 'react';
import LineGraph from './LineGraph';
import './App.css';

function App() {

  const [eth, setEth] = useState({currentValue: 0, change: 0, color: ''})
  const [dots, setDots] = useState([])
  const [ethToDollar, setEthToDollar] = useState({ input: 0, output: 0 })
  const [dollarToEth ,setDollarToEth] = useState({ input: 0, output: 0 })

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
    setEthToDollar({input: e.target.value, output: (e.target.value * eth.currentValue).toFixed(2)})
  }

  const handleConvertionToEth = (e) => {
    setDollarToEth({input: e.target.value, output: (e.target.value / eth.currentValue).toFixed(2)})
  }

  return (
    <div className="App">
      <h1>ETH</h1>

      <div className='eth'>
        <p>${eth.currentValue} Dollars <span className='change' style={{ background: eth.color }}>{eth.change}%</span></p>
        <LineGraph dots={dots} />
      </div>
      
      <div className='convertors'>
        <label>Eth To Dollar</label>
        <input type='text' value={ethToDollar.input} onChange={handleConvertionToDollar} />
        <p>{ethToDollar.output}$</p>

        <label>Dollar To Eth</label>
        <input type='text' value={dollarToEth.input} onChange={handleConvertionToEth} />
        <p>{dollarToEth.output} ETH</p>
      </div>

    </div>
  );
}

export default App;