/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Input } from '@mui/material'
// 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

function getAutoCompleteResults(query: string, signal?: AbortSignal): Promise<string[]> {
	const fruits = [
		"Apple", 
		"Banana", 
		"Kiwi", 
		"Orange", 
		"Strawberry", 
		"Watermelon", 
		"Mango", 
		"Grape", 
		"Lemon", 
		"Lime", 
		"Peach", 
		"Pear", 
		"Raspberry", 
		"Blueberry", 
		"Cucumber", 
		"Cranberry"
	];

	return new Promise((resolve, reject) => {
		setTimeout(()=>{
			//if the signal is aborted, we will reject the promise
			//reject results of "be", only show results of "berry"
			if(signal?.aborted) {
				reject(signal.reason)
			}

			resolve(
				fruits.filter((fruit) => 
					fruit.toLowerCase().includes(query.toLowerCase())
				)
			);
		}, Math.random() * 1000)
	})
}

function useDebouncevalue(value: string, time=250) {
	const [debounceValue, setDebounceValue] = useState(value)

	useEffect( ()=> {
		const timeout = setTimeout(() => {
			setDebounceValue(value)
		}, time)
		return ()=>{
			clearTimeout(timeout)
		}
	}, [value, time]); 

	return debounceValue;
}
 
function App() {

	const [query, setQuery] = useState('')
	const [suggestions, setSuggestions] = useState<string[]>([]); 
	const debounceQuery = useDebouncevalue(query); 
	
	const controller = new AbortController()


	useEffect(() => {
		const signal = controller.signal; 
		(async() => {
			if(!debounceQuery){ 
				setSuggestions([]) 
				return; 
			}

			const data = await getAutoCompleteResults(debounceQuery, signal)
			setSuggestions(data)
		})();
		//when debounceQuery changes, we have a new set of data that we are trying to fetch. 
		//so whatever previous fetch req we have, we have to terminate those. 
		return ()=> controller.abort("cancel request"); 
	}, [debounceQuery])

	return (<div className='w-full h-screen flex flex-col items-center bg-gray-900'> 
		<Input type='text' placeholder='search fruit' value={query} onChange={(e) => setQuery(e.target.value)}></Input>

		<div className='text-gray-200 flex flex-col gap-2 items-start' style={{padding: 20}}>
			{suggestions.map(suggestion => <div key={suggestion}>{suggestion}</div>)}
		</div>
	</div>)
}

export default App
