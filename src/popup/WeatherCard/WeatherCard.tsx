import React, { useEffect, useState } from 'react'

import './WeatherCard.css'
import { fetchOperationWeatherData, OpenWeatherData } from '../../utils/api'

import {
	Box,
	Card,
	Button,
	CardContent,
	Typography,
	CardActions,
} from '@material-ui/core'

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
							Delete
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
	onDelete?: () => void
}> = ({ city, onDelete }) => {
	const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null)
	const [cardState, setCardState] = useState<WeatherCardState>('loading')

	useEffect(() => {
		fetchOperationWeatherData(city)
			.then((data) => {
				//console.log(data)
				setWeatherData(data)
				setCardState('ready')
			})
			.catch((err) => {
				console.log(err)
				setCardState('error')
			})
	}, [city])

	if (cardState == 'loading' || cardState == 'error') {
		return (
			<WeatherCardContainer onDelete={onDelete}>
				<Typography variant="body1">
					{cardState == 'loading'
						? 'Loading...'
						: 'Error: could not retrieve weather data'}
				</Typography>
			</WeatherCardContainer>
		)
	}

	return (
		<WeatherCardContainer onDelete={onDelete}>
			<Typography variant="h5">{weatherData.name}</Typography>
			<Typography variant="body1">
				{Math.round(weatherData.main.temp)}
			</Typography>
			<Typography variant="body1">
				Feels like: {Math.round(weatherData.main.feels_like)}
			</Typography>
		</WeatherCardContainer>
	)
}

export default WeatherCard
