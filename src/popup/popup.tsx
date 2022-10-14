import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { Box, Grid, InputBase, IconButton, Paper } from '@material-ui/core'
import { Add as AddIcon } from '@material-ui/icons'
import './popup.css'
import WeatherCard from './WeatherCard'
import 'fontsource-roboto'
import { setStoredCities, getStoredCities } from '../utils/storage'

const App: React.FC<{}> = () => {
	const [cities, setCities] = useState<string[]>([])
	const [cityInput, setCityInput] = useState<string>('')

	useEffect(() => {
		getStoredCities().then((cities) => setCities(cities))
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
			</Grid>
			{cities.map((city, index) => (
				<WeatherCard
					city={city}
					key={index}
					onDelete={() => handleCityDelete(index)}
				/>
			))}
			<Box height="16px" />
		</Box>
	)
}

const container = document.createElement('div')
document.body.appendChild(container)
ReactDOM.render(<App />, container)
