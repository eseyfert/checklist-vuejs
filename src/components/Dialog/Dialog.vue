<template>
	<div
		ref="container"
		class="mdf-dialog-container"
		:class="{ 'mdf-dialog-container--active': active }"
		:aria-hidden="!active ? true : null"
		:aria-modal="active ? true : null"
	>
		<div
			ref="dialog"
			class="mdf-dialog"
			role="dialog"
			aria-labelledby="dialog-title"
			aria-describedby="dialog-desc"
		>
			<div class="mdf-dialog__header">
				<h2 id="dialog-title" class="mdf-dialog__title">{{ title }}</h2>

				<button class="mdf-dialog__close" aria-label="Close dialog" @click="$emit('cancel')">
					<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
						<use href="/images/icons.svg#clear"></use>
					</svg>
				</button>
			</div>

			<div class="mdf-dialog__content">
				<p id="dialog-desc">{{ message }}</p>
			</div>

			<div class="mdf-dialog__actions">
				<button class="mdf-button" @click="$emit('cancel')">Cancel</button>
				<button class="mdf-button" @click="$emit('confirm')">Confirm</button>
			</div>
		</div>

		<div class="mdf-dialog-backdrop" @click="$emit('cancel')"></div>
	</div>
</template>

<style lang="scss" scoped>
@forward '~@miraidesigns/dialog/styles';
</style>

<script lang="ts">
import { defineComponent } from 'vue';
import { getScrollbarParent } from '../../helpers';

interface DialogData {
	container: HTMLElement | null;
	dialog: HTMLElement | null;
	focusableElements: HTMLElement[] | null;
	focusIndex: number;
	lastActiveElement: HTMLElement | null;
	scrollbarParent: HTMLElement | null;
}

const CLASS = {
	disableScrollbar: 'mdf-scrollbar-hidden',
	fadeIn: 'mdf-dialog-container--fade-in',
};

const SELECTOR = {
	app: '.mdf-app',
	container: '.mdf-dialog-container',
	focus: 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe:not([tabindex^="-"]), [tabindex]:not([tabindex^="-"])',
};

export default defineComponent({
	data() {
		return {
			container: null,
			dialog: null,
			focusableElements: null,
			focusIndex: 0,
			lastActiveElement: null,
			scrollbarParent: null,
		} as DialogData;
	},
	props: ['active', 'title', 'message', 'keyboard'],
	emits: ['cancel', 'confirm'],
	methods: {
		setFocusOnElem(index: number) {
			this.focusableElements![index].focus();
		},
		focusPreviousElem() {
			if (this.focusIndex >= 1) {
				// Move to the previous element.
				this.focusIndex--;
			} else if (this.focusIndex === 0) {
				// If we are on the first element, wrap back around to the last element.
				this.focusIndex = this.focusableElements!.length - 1;
			}

			// We move the focus to the previous element.
			this.setFocusOnElem(this.focusIndex);
		},
		focusNextElem(): void {
			if (this.focusIndex === this.focusableElements!.length - 1) {
				// If we are on the last element, wrap back around to the first element.
				this.focusIndex = 0;
			} else if (this.focusIndex >= 0) {
				// Move to the next element.
				this.focusIndex++;
			}

			// We move the focus to the next element.
			this.setFocusOnElem(this.focusIndex);
		},
		keyboardEvents($event: KeyboardEvent) {
			if ($event.key === 'Tab' && $event.shiftKey) {
				// Tab backwards, focus the previous element.
				$event.preventDefault();
				this.focusPreviousElem();
			} else if ($event.key === 'Tab') {
				// Tab forwards, focus the next element.
				$event.preventDefault();
				this.focusNextElem();
			} else if ($event.key === 'Escape') {
				// Escape cancels the Dialog.
				$event.preventDefault();
				this.$emit('cancel');
			}
		},
	},
	mounted() {
		this.$nextTick(() => {
			// Get the dialog container element.
			this.container = this.$refs.container as HTMLElement;

			// Get the dialog content.
			this.dialog = this.$refs.dialog as HTMLElement;

			if (this.container) {
				// Get the app container element.
				const appContainer = document.querySelector(SELECTOR.app);

				// Move the dialog to the bottom of the app container so it displays properly.
				appContainer!.append(this.$el);

				// Store the last active (focused) element before the dialog was called.
				this.lastActiveElement = document.activeElement as HTMLElement;

				// Look for the first parent element that has overflowing content.
				this.scrollbarParent = getScrollbarParent(this.container, SELECTOR.container);

				// Create a list of all focusable elements INSIDE the dialog.
				this.focusableElements = Array.from(this.container.querySelectorAll(SELECTOR.focus));

				// Fade-in the dialog.
				setTimeout(() => {
					(this.container as HTMLElement).classList.add(CLASS.fadeIn);
				}, 60);

				// Temporarily disable scrolling for the scrollbar parent.
				this.scrollbarParent.classList.add(CLASS.disableScrollbar);

				if (this.keyboard) {
					// Set focus to the first focusable element in the dialog.
					this.focusableElements[0].focus();

					// Add keyboard events.
					document.addEventListener('keydown', this.keyboardEvents);
				}
			}
		});
	},
	beforeUnmount() {
		// Enable scrolling again for the scrollbar parent.
		this.scrollbarParent!.classList.remove(CLASS.disableScrollbar);

		if (this.keyboard) {
			// Move focus to the last active element.
			this.lastActiveElement!.focus();

			// Remove keyboard events.
			document.removeEventListener('keydown', this.keyboardEvents);
		}
	},
});
</script>
