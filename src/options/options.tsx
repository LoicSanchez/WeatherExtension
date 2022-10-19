import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './options.css'
import '@fontsource/roboto'
import {
	getStoredOptions,
	setStoredOptions,
	LocalStorageOptions,
} from '../utils/storage'

import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Grid, Switch, TextField, Box, Card } from '@mui/material'

type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {
	const [options, setOptions] = useState<LocalStorageOptions | null>(null)
	const [formState, setFormState] = useState<FormState>('ready')

	useEffect(() => {
		getStoredOptions().then((options) => setOptions(options))
	}, [])

	const handleHomeCityChange = (homeCity: string) => {
		setOptions({
			...options,
			homeCity,
		})
	}

	const handleAutoOverlayChange = (hasAutoOverlay: boolean) => {
		setOptions({
			...options,
			hasAutoOverlay,
		})
	}

	const handleSaveButtonClick = () => {
		setFormState('saving')
		setStoredOptions(options).then(() => {
			setTimeout(() => {
				setFormState('ready')
			}, 500)
		})
	}

	if (!options) {
		return null
	}

	const isFieldDisabled = formState === 'saving'

	return (
		<Box mx="10%" my="2%">
			<Card>
				<CardContent>
					<Grid
						container
						direction="column"
						justifyContent="flex-start"
						alignItems="flex-start"
						spacing={4}
					>
						<Grid item>
							<Typography variant="h4">
								Weather Extension Options
							</Typography>
						</Grid>
						<Grid item>
							<Typography variant="body1">Home City</Typography>
							<TextField
								fullWidth
								placeholder="Enter the home city"
								value={options.homeCity}
								onChange={(event) =>
									handleHomeCityChange(event.target.value)
								}
								disabled={isFieldDisabled}
							/>
						</Grid>
						<Grid item>
							<Typography variant="body1">Overlay</Typography>
							<Switch
								color="primary"
								checked={options.hasAutoOverlay}
								onChange={(event, checked) =>
									handleAutoOverlayChange(checked)
								}
								disabled={isFieldDisabled}
							/>
						</Grid>
						<Grid item>
							<Button
								variant="contained"
								color="primary"
								onClick={handleSaveButtonClick}
								disabled={isFieldDisabled}
							>
								{formState === 'ready' ? 'Save' : 'Saving...'}
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>
		</Box>
	)
}

const container = document.createElement('div')
document.body.appendChild(container)

const root = createRoot(container!)
root.render(<App />)
