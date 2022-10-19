import React, { useEffect, useState } from 'react'

import './WeatherCard.css'
import {
	fetchOperationWeatherData,
	getWeatherIconSrc,
	OpenWeatherData,
	OpenWeatherTempScale,
} from '../../utils/api'

import {
	Box,
	Card,
	CardActions,
	CardContent,
	Button,
	Grid,
	Typography,
} from '@mui/material'

const WeatherCardContainer: React.FC<{
	children: React.ReactNode
	onDelete?: () => void
}> = ({ children, onDelete }) => {
	return (
		<Box mx={'4px'} my={'16px'}>
			<Card>
				<CardContent>{children}</CardContent>
				<CardActions>
					{onDelete && (
						<Button onClick={onDelete} color="secondary">
							<Typography className="weatherCard-body">
								Delete
							</Typography>
						</Button>
					)}
				</CardActions>
			</Card>
		</Box>
	)
}

type WeatherCardState = 'loading' | 'error' | 'ready'

const WeatherCard: React.FC<{
	city: string
	tempScale: OpenWeatherTempScale
	onDelete?: () => void
}> = ({ city, tempScale, onDelete }) => {
	const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null)
	const [cardState, setCardState] = useState<WeatherCardState>('loading')

	useEffect(() => {
		fetchOperationWeatherData(city, tempScale)
			.then((data) => {
				//console.log(data)
				setWeatherData(data)
				setCardState('ready')
			})
			.catch((err) => {
				console.log(err)
				setCardState('error')
			})
	}, [city, tempScale])

	if (cardState == 'loading' || cardState == 'error') {
		return (
			<WeatherCardContainer onDelete={onDelete}>
				<Typography className="weatherCard-title">{city}</Typography>
				<Typography className="weatherCard-body">
					{cardState == 'loading'
						? 'Loading...'
						: 'Error: could not retrieve weather data'}
				</Typography>
			</WeatherCardContainer>
		)
	}

	return (
		<WeatherCardContainer onDelete={onDelete}>
			<Grid container justifyContent="space-between">
				<Grid item>
					<Typography className="weatherCard-title">
						{weatherData.name}
					</Typography>
					<Typography className="weatherCard-body-temp">
						{Math.round(weatherData.main.temp)}
					</Typography>
					<Typography className="weatherCard-body">
						Feels like: {Math.round(weatherData.main.feels_like)}
					</Typography>
				</Grid>
				<Grid item>
					{weatherData.weather.length > 0 && (
						<>
							<img
								src={getWeatherIconSrc(weatherData.weather[0].icon)}
								className="weatherCard-img-weather"
							/>
							<Typography className="weatherCard-body-weather-main">
								{weatherData.weather[0].main}
							</Typography>
						</>
					)}
				</Grid>
			</Grid>
		</WeatherCardContainer>
	)
}

export default WeatherCard
