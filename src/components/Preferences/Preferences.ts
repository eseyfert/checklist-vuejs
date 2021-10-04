interface PreferencesData {
	accent: string;
	accents: string[];
	accentSwatches: HTMLElement[] | null;
	appContainer: HTMLElement | null;
	gradient: string;
	gradients: string[];
	gradientSwatches: HTMLElement[] | null;
	useDarkTheme: boolean;
	theme: string;
}

import { defineComponent } from 'vue';
import { removeClassByPrefix } from '../../helpers';

export default defineComponent({
	data() {
		return {
			accent: '',
			accents: [],
			accentSwatches: null,
			appContainer: null,
			gradient: '',
			gradients: [],
			gradientSwatches: null,
			useDarkTheme: false,
			theme: '',
		} as PreferencesData;
	},
	props: ['active'],
	methods: {
		get(setting: string): string | null {
			return localStorage.getItem(`app-${setting}`);
		},
		set(setting: string, value: string): void {
			localStorage.setItem(`app-${setting}`, value);
		},
		setDefaults(): void {
			if (!this.accent) {
				this.set('accent', 'green');
			}

			if (!this.gradient) {
				this.set('gradient', 'Quepal');
			}

			if (!this.theme) {
				this.set('theme', 'light');
			}
		},
		changeAccent(accent: string, $event: Event): void {
			// Update the accent color in storage.
			this.set('accent', accent);

			// Remove the old accent class.
			removeClassByPrefix(document.body, 'mdf-accent-');

			// Add the new accent class.
			document.body.classList.add(`mdf-accent-${accent}`);

			// Set all color swatches as not active.
			if (this.accentSwatches) {
				for (const swatch of this.accentSwatches) {
					swatch.classList.remove('mdf-color--active');
				}
			}

			// Set clicked color swatch as active.
			($event.target as HTMLElement).classList.add('mdf-color--active');
		},
		changeGradient(gradient: string, $event: Event): void {
			// Update the gradient in storage.
			this.set('gradient', gradient);

			if (this.appContainer) {
				// Remove the old gradient class.
				removeClassByPrefix(this.appContainer, 'mdf-gradient-');

				// Add the new gradient class.
				this.appContainer.classList.add(`mdf-gradient-${gradient}`);
			}

			// Set all color swatches as not active.
			if (this.gradientSwatches) {
				for (const swatch of this.gradientSwatches) {
					swatch.classList.remove('mdf-color--active');
				}
			}

			// Set clicked color swatch as active.
			($event.target as HTMLElement).classList.add('mdf-color--active');
		},
		toggleDarkTheme(): void {
			// Get the current theme.
			const theme = this.get('theme');

			if (theme === 'light') {
				// Light theme is active, change to dark mode.
				this.useDarkTheme = true;
				this.set('theme', 'dark');
				document.body.classList.add('mdf-theme-dark');
			} else if (theme === 'dark') {
				// Dark theme is active, change back to light mode.
				this.useDarkTheme = false;
				this.set('theme', 'light');
				document.body.classList.remove('mdf-theme-dark');
			}
		},
	},
	created() {
		// Add all available accents.
		this.accents = ['red', 'purple', 'pink', 'blue', 'teal', 'green', 'yellow', 'orange', 'deep-orange'];

		// Add all available gradients.
		this.gradients = [
			'JShine',
			'MegaTron',
			'Yoda',
			'Amin',
			'WitchingHour',
			'Flare',
			'KyooPal',
			'KyeMeh',
			'ByDesign',
			'BurningOrange',
			'Wiretap',
			'SummerDog',
			'SinCityRed',
			'BlueRaspberry',
			'eXpresso',
			'Quepal',
		];

		// Store current user preferences.
		// eslint-disable-next-line
		this.accent = this.get('accent')!;
		// eslint-disable-next-line
		this.gradient = this.get('gradient')!;
		// eslint-disable-next-line
		this.theme = this.get('theme')!;

		// If no user preferences exist yet, save default values.
		this.setDefaults();
	},
	mounted() {
		// Wait until DOM is fully rendered.
		this.$nextTick(() => {
			this.appContainer = document.querySelector('.mdf-app');

			this.accentSwatches = Array.from(document.querySelectorAll('#accents .mdf-color'));

			this.gradientSwatches = Array.from(document.querySelectorAll('#gradients .mdf-color'));

			if (this.theme === 'dark') {
				this.useDarkTheme = true;
			}
		});
	},
});
