<template>
	<Landing
		:active="landingActive"
		:changes="getChanges"
		@add="openAdd"
		@preferences="openPreferences"
		@edit="openEdit"
		@view="openView"
		@refresh="refreshLanding"
		@message="showMessage"
	></Landing>

	<component
		:is="currentSlideComponent"
		:active="landingActive"
		:data="getData"
		@back="goBack"
		@refresh="refreshLanding"
		@message="showMessage"
	></component>

	<Snackbar :message="getSnackbarMessage" :messages="getSnackbarMessages"></Snackbar>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { markRaw } from 'vue';
import { debounce } from './helpers';
import { ChecklistData } from './types';

import Landing from './components/Landing/Landing.vue';
import Preferences from './components/Preferences/Preferences.vue';
import Add from './components/Add/Add.vue';
import Edit from './components/Edit/Edit.vue';
import View from './components/View/View.vue';
import Snackbar from './components/Snackbar/Snackbar.vue';

@Options({
	components: { Landing, Preferences, Add, Edit, View, Snackbar },
	data() {
		return {
			appContainer: null,
			checklistData: null,
			container: null,
			currentSlide: null,
			landingActive: true,
			landingRefresh: 0,
			slides: document.getElementsByClassName('mdf-slide'),
			slideWidth: 0,
			snackbarMessage: '',
			snackbarMessages: 0,
			styles: null,
		};
	},
	methods: {
		openPreferences() {
			// Show Preferences slide.
			this.currentSlide = markRaw(Preferences);
			this.goForward();
		},
		openAdd() {
			// Show Add slide.
			this.currentSlide = markRaw(Add);
			this.goForward();
		},
		openEdit(data: ChecklistData) {
			// Show Edit slide with the given data.
			this.checklistData = data;
			this.currentSlide = markRaw(Edit);
			this.goForward();
		},
		openView(data: ChecklistData) {
			// Show View slide with the given data.
			this.checklistData = data;
			this.currentSlide = markRaw(View);
			this.goForward();
		},
		goForward() {
			// Move forward, away from the Landing slide.
			this.slideLeft();
			this.landingActive = false;
		},
		goBack() {
			// Move back to the Landing slide.
			this.slideRight();
			this.landingActive = true;
			setTimeout(() => (this.currentSlide = null), 360);
		},
		showMessage(message: string) {
			// Show the given Snackbar message.
			this.snackbarMessages++;
			this.snackbarMessage = message;
		},
		refreshLanding() {
			// Refresh the Landing slide.
			this.landingRefresh++;
		},
		applyPreferences() {
			// Get the user preferences.
			const accent = localStorage.getItem('app-accent');
			const gradient = localStorage.getItem('app-gradient');
			const theme = localStorage.getItem('app-theme');

			// Apply the dark theme if needed.
			if (theme && theme === 'dark') {
				document.body.classList.add('mdf-theme-dark');
			}

			// Apply the accent color.
			if (accent) {
				document.body.classList.add(`mdf-accent-${accent}`);
			}

			// Apply the background gradient.
			if (gradient) {
				this.appContainer.classList.add(`mdf-gradient-${gradient}`);
			}
		},
		slideLeft() {
			// Move all slides to the left.
			this.container.style.transform = `translateX(-${this.slideWidth}px)`;
		},
		slideRight() {
			// Move all slides to the right.
			this.container.style.transform = 'translateX(0px)';
		},
		calcWidth() {
			// Get the CSS properties for the first slide.
			this.styles = window.getComputedStyle((this.container as HTMLElement).firstElementChild as HTMLElement);

			// Calculate the proper width.
			this.slideWidth = parseFloat(this.styles.width) + parseFloat(this.styles.marginRight);

			// Make sure to properly position the currently displayed slide.
			if (this.container.style.transform.includes('-')) {
				this.container.style.transform = `translateX(-${this.slideWidth}px)`;
			}
		},
	},
	computed: {
		getData() {
			return this.checklistData;
		},
		getChanges(): number {
			return this.landingRefresh;
		},
		currentSlideComponent() {
			return this.currentSlide;
		},
		isLandingActive(): boolean {
			return this.landingActive;
		},
		getSnackbarMessage(): string {
			return this.snackbarMessage;
		},
		getSnackbarMessages(): number {
			return this.snackbarMessages;
		},
	},
	mounted() {
		this.$nextTick(() => {
			// Set the app container element.
			this.appContainer = document.querySelector('.mdf-app');
			// Apply user preferences.
			this.applyPreferences();

			// Set the slides container element.
			this.container = (this.$el as HTMLElement).parentElement;
			// Calculate the needed slides width.
			this.calcWidth();

			// Re-calculate slide width on window resize.
			window.onresize = debounce(() => this.calcWidth(), 60);
		});
	},
})
export default class App extends Vue {}
</script>

<style lang="scss">
@forward 'App.scss';
</style>
