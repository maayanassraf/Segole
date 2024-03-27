import { useEffect, useState, useRef } from 'react';
import LineGraph from './LineGraph';
import './App.css';

function App() {

  const [eth, setEth] = useState({currentValue: 0, change: 0, color: ''})
  const [dots, setDots] = useState({ prices: [], hours: [] })
  const [ethValue, setEthValue] = useState(0)
  const [dollarValue ,setDollarValue] = useState(0)
  const intervalRef = useRef(null)

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
          
          let priceAndHour = data.prices.map(price => {
            const t = new Date(price[0])
            if(t.getMinutes() < 4)
              return {price: price[1].toFixed(2), hour: `${t.getHours()}:00`}
            return null
          })
          priceAndHour = priceAndHour.filter(value => value)
          const hours = priceAndHour.map(value => value.hour)
          const prices = priceAndHour.map(value => value.price)

          setEth({currentValue: currentValue.toFixed(2), change: change.toFixed(2), color: color})
          setDots({ prices: prices, hours: hours })
        }
      }
      catch{
        console.log("Error!")
      }
    }
    
    getData()

    intervalRef.current = setInterval(async () => {
        getData()
    }, 1000 * 30) 

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  const handleConvertionToDollar = (e) => {
    if(e.target.value < 0)
      setDollarValue(0)
    else{
      setEthValue(e.target.value)
      setDollarValue((e.target.value * eth.currentValue).toFixed(2))
    }
  }

  const handleConvertionToEth = (e) => {
    if(e.target.value < 0)
      setEthValue(0)
    else{
      setDollarValue(e.target.value)
      setEthValue((e.target.value / eth.currentValue).toFixed(2))
    }
  }

  return (
    <div className="App">
      <h1>ETH</h1>

      <div className='eth'>
        <p>${eth.currentValue} Dollars <span className='change' style={{ background: eth.color }}>{eth.change}%</span></p>
        <LineGraph dots={dots} />
      </div>
      
      <div className='convertors'>
        <p>Convert:</p>

        <div className='convertors-inputs'>

          <div className='convertor'>
            <label>ETH:</label>
            <input type='number' value={ethValue} onChange={handleConvertionToDollar} placeholder='ETH' />
          </div>

          <div className='convertor dollar'>
            <label>DOLLAR:</label>
            <input type='number' value={dollarValue} onChange={handleConvertionToEth} placeholder='DOLLAR' /></div> 
        </div>
      </div>

    </div>
  );
}

export default App;