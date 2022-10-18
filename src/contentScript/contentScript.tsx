import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import WeatherCard from '../components/WeatherCard'
import './contentScript.css'
import { Card } from '@material-ui/core'
import { getStoredOptions, LocalStorageOptions } from '../utils/storage'
import { Messages } from '../utils/messages'

const App: React.FC<{}> = () => {
	const [options, setOptions] = useState<LocalStorageOptions | null>(null)
	const [isActive, setIsActive] = useState<boolean>(false)

	useEffect(() => {
		getStoredOptions().then((options) => {
			setOptions(options)
			setIsActive(options.hasAutoOverlay)
		})
	}, [])

	useEffect(() => {
		chrome.runtime.onMessage.addListener((msg) => {
			if (msg === Messages.TOGGLE_OVERLAY) {
				setIsActive(!isActive)
			}
		})
	}, [isActive])

	if (!options) {
		return null
	}

	return (
		<>
			{isActive && (
				<Card className="overlayCard">
					<WeatherCard
						city={options.homeCity}
						tempScale={options.tempScale}
						onDelete={() => setIsActive(false)}
					></WeatherCard>
				</Card>
			)}
		</>
	)
}

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)
