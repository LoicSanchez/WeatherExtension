import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
	setStoredCities,
	getStoredCities,
	setStoredOptions,
	getStoredOptions,
	LocalStorageOptions,
} from '../utils/storage'
import { Messages } from '../utils/messages'
import '@fontsource/roboto'
import './popup.css'
import WeatherCard from '../components/WeatherCard'
import { Grid, Box, Paper, IconButton, InputBase } from '@mui/material'
import {
	Add as AddIcon,
	PictureInPicture as PictureInPictureIcon,
} from '@mui/icons-material'

const App: React.FC<{}> = () => {
	const [cities, setCities] = useState<string[]>([])
	const [cityInput, setCityInput] = useState<string>('')
	const [options, setOptions] = useState<LocalStorageOptions | null>(null)

	useEffect(() => {
		getStoredCities().then((cities) => setCities(cities))
		getStoredOptions().then((options) => setOptions(options))
	}, [])

	const handleCityButtonClick = () => {
		if (cityInput === '') {
			return
		}
		const updatedCities = [...cities, cityInput]
		setStoredCities(updatedCities).then(() => {
			setCities(updatedCities)
			setCityInput('')
		})
	}

	const handleCityDelete = (index: number) => {
		cities.splice(index, 1)
		const updatedCities = [...cities]
		setStoredCities(updatedCities).then(() => {
			setCities(updatedCities)
		})
	}

	const handleTempScaleButtonClick = () => {
		const updateOptions: LocalStorageOptions = {
			...options,
			tempScale: options.tempScale === 'metric' ? 'imperial' : 'metric',
		}
		setStoredOptions(updateOptions).then(() => {
			setOptions(updateOptions)
		})
	}

	const handleOverlayButtonClick = () => {
		chrome.tabs.query(
			{
				active: true,
			},
			(tab) => {
				if (tab.length > 0) {
					chrome.tabs.sendMessage(tab[0].id, Messages.TOGGLE_OVERLAY)
				}
			}
		)
	}

	if (!options) {
		return null
	}

	return (
		<Box mx="8px" my="16px">
			<Grid container>
				<Grid item>
					<Paper>
						<Box px="15px" py="5px">
							<InputBase
								placeholder="Add a city name"
								value={cityInput}
								onChange={(event) => setCityInput(event.target.value)}
							/>
							<IconButton onClick={handleCityButtonClick}>
								<AddIcon></AddIcon>
							</IconButton>
						</Box>
					</Paper>
				</Grid>
				<Grid item>
					<Paper>
						<Box py="3px">
							<IconButton onClick={handleTempScaleButtonClick}>
								{options.tempScale === 'metric' ? '\u2103' : '\u2109'}
							</IconButton>
						</Box>
					</Paper>
				</Grid>
				<Grid item>
					<Paper>
						<Box py="5px">
							<IconButton onClick={handleOverlayButtonClick}>
								<PictureInPictureIcon />
							</IconButton>
						</Box>
					</Paper>
				</Grid>
			</Grid>
			{options.homeCity != '' && (
				<WeatherCard
					city={options.homeCity}
					tempScale={options.tempScale}
				/>
			)}
			{cities.map((city, index) => (
				<WeatherCard
					city={city}
					key={index}
					tempScale={options.tempScale}
					onDelete={() => handleCityDelete(index)}
				/>
			))}
			<Box height="16px" />
		</Box>
	)
}

const container = document.createElement('div')
document.body.appendChild(container)

const root = createRoot(container!)
root.render(<App />)
