<template>
	<div class="mdf-snackbar" :class="{ 'mdf-snackbar--active': isActive }" role="status" aria-live="polite">
		<span class="mdf-snackbar__text"></span>

		<div class="mdf-snackbar__actions">
			<button class="mdf-snackbar__close" aria-label="Dismiss snackbar" @click="hideSnackbar">
				<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
					<use href="/images/icons.svg#clear"></use>
				</svg>
			</button>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@forward '~@miraidesigns/snackbar/styles';
</style>

<script lang="ts">
import { defineComponent } from 'vue';

interface SnackbarData {
	active: boolean;
	container: HTMLElement | null;
	delay: number;
	queue: string[];
	text: string;
	textContainer: HTMLElement | null;
	timeout: number;
}

const ATTR = {
	live: 'aria-live',
	message: 'data-snackbar-message',
};

const CLASS = {
	active: 'mdf-snackbar--active',
};

const SELECTOR = {
	app: '.mdf-app',
	container: '.mdf-snackbar',
	text: '.mdf-snackbar__text',
};

export default defineComponent({
	data() {
		return {
			active: false,
			container: null,
			delay: 5000,
			queue: [],
			text: this.message,
			textContainer: null,
			timeout: 0,
		} as SnackbarData;
	},
	props: ['message', 'messages'],
	watch: {
		messages() {
			this.showSnackbar(this.message);
		},
	},
	computed: {
		isActive(): boolean {
			return this.active;
		},
	},
	methods: {
		showSnackbar(message: string) {
			// If a snackbar is still active, add message to queue and don't continue.
			if (this.active) {
				this.queue.push(message);
				return;
			}

			// Clear the snackbar timeout id.
			clearTimeout(this.timeout);

			// Set snackbar message.
			this.text = message;
			this.textContainer!.textContent = message;

			// Set the snackbar as `active`.
			this.active = true;

			// Announce message to assistive technologies.
			this.announceSnackbar();

			// Show the snackbar element.
			this.container!.classList.add(CLASS.active);

			// After a set delay, hide the snackbar element.
			this.timeout = window.setTimeout(() => this.hideSnackbar(), this.delay);
		},
		announceSnackbar() {
			// Don't continue if the snackbar is hidden.
			if (!this.active) return;

			// Set the `aria-live` attribute to `off` while we manipulate the element.
			this.container!.setAttribute(ATTR.live, 'off');

			/**
			 * Temporarily empty out the textContent to force the screen readers to detect a change.
			 * Based on: https://github.com/material-components/material-components-web/commit/b4b19b720417bea5f211be1e37821ffb7a5c0759
			 */
			this.textContainer!.textContent = '';
			this.textContainer!.innerHTML = '<span style="display: inline-block; width: 0; height: 1px;">&nbsp;</span>';

			// Temporarily display the message through the `::before` pseudo element while we reset the textContent.
			this.textContainer!.setAttribute(ATTR.message, this.text);

			setTimeout(() => {
				// We change the `aria-live` attribute to `polite` so screen readers can announce the message.
				this.container!.setAttribute(ATTR.live, 'polite');

				// Remove the `::before` text.
				this.textContainer!.removeAttribute(ATTR.message);

				// Restore the original snackbar message to have the screen reader announce it.
				this.textContainer!.textContent = this.text;
			}, 1000);
		},
		displayNextMessage() {
			// Queue is empty, don't continue.
			if (!this.queue.length) return;

			// Display next message.
			this.showSnackbar(this.queue.shift()!);
		},
		hideSnackbar(): void {
			// Hide the snackbar element.
			this.container!.classList.remove(CLASS.active);

			// Function will fire as soon as the snackbar element transition has ended.
			const waitForTransition = () => {
				// Clear the snackbar timeout id.
				clearTimeout(this.timeout);

				// Set 'active' status to 'false'.
				this.active = false;

				// Show next message.
				this.displayNextMessage();

				// Remove 'transitionend' event from snackbar element.
				this.container!.removeEventListener('transitionend', waitForTransition);
			};

			// Add 'transitionend' event to the snackbar element.
			this.container!.addEventListener('transitionend', waitForTransition);
		},
		keyboardEvents(evt: KeyboardEvent) {
			// Make sure the user pressed the `ESC` key.
			if (evt.key === 'Escape') {
				// Prevent default behavior.
				evt.preventDefault();

				// If the snackbar is currently visible, hide it.
				if (this.active && this.container!.classList.contains(CLASS.active)) {
					this.hideSnackbar();
				}
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			// Get the snackbar container.
			this.container = document.querySelector(SELECTOR.container);

			if (this.container) {
				// Get app container element.
				const appContainer = document.querySelector(SELECTOR.app);

				if (appContainer) {
					// Move snackbar so it displays properly.
					appContainer.append(this.$el);
				}

				// Get the text container.
				this.textContainer = this.container.querySelector(SELECTOR.text);

				// Add keyboard events.
				document.addEventListener('keydown', this.keyboardEvents);
			}
		});
	},
	unmounted() {
		// Remove keyboard events.
		document.removeEventListener('keydown', this.keyboardEvents);
	},
});
</script>
