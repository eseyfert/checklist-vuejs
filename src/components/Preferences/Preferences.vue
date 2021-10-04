<template>
	<div class="mdf-slide" :tabindex="active ? '-1' : null">
		<header class="mdf-slide__header">
			<div class="mdf-slide__controls">
				<button
					class="mdf-button mdf-button--icon"
					aria-label="Return to the previous page"
					@click="$emit('back')"
				>
					<svg class="mdf-icon mdf-rotate-180" viewBox="0 0 24 24" aria-hidden="true">
						<use href="/images/icons.svg#arrow-keyboard" />
					</svg>
				</button>
			</div>

			<h2 class="mdf-slide__title">
				Change your
				<strong>preferences.</strong>
			</h2>
		</header>

		<main class="mdf-slide__main">
			<div class="mdf-slide__content">
				<div id="accents" class="mdf-group">
					<div class="mdf-group__header">
						<h6 class="mdf-group__title">Accents</h6>
						<p class="mdf-group__description">
							Choose the color that is applied to things like emphasis text, buttons, icons or text
							inputs.
						</p>
					</div>

					<div class="mdf-group__grid">
						<div
							v-for="color of accents"
							:key="color"
							class="mdf-color"
							:class="`mdf-accent-${color} ${accent === color ? 'mdf-color--active' : ''}`"
							:aria-label="`Change color to ${color}`"
							@click="changeAccent(color, $event)"
						></div>
					</div>
				</div>

				<div id="gradients" class="mdf-group">
					<div class="mdf-group__header">
						<h6 class="mdf-group__title">Gradients</h6>
						<p class="mdf-group__description">
							Choose one of these stunning gradients as your app's background color.
						</p>
					</div>

					<div class="mdf-group__grid">
						<div
							v-for="color of gradients"
							:key="color"
							class="mdf-color"
							:class="`mdf-gradient-${color} ${gradient === color ? 'mdf-color--active' : ''}`"
							:aria-label="`Change gradient to ${color}`"
							@click="changeGradient(color, $event)"
						></div>
					</div>
				</div>

				<div id="theme" class="mdf-group">
					<div class="mdf-group__header">
						<h6 class="mdf-group__title">Theme</h6>
						<p class="mdf-group__description">
							Toggle dark mode if you're a night owl or simply like darker colors.
						</p>
					</div>

					<div class="mdf-group__grid">
						<div class="mdf-control">
							<div class="mdf-switch">
								<input
									id="switch"
									class="mdf-switch__input"
									type="checkbox"
									role="switch"
									:checked="useDarkTheme"
									@change="toggleDarkTheme()"
								/>

								<div class="mdf-switch__track"></div>
								<div class="mdf-switch__thumb"></div>
								<div class="mdf-switch__shadow"></div>
							</div>

							<label for="switch">Enable dark mode</label>
						</div>
					</div>
				</div>
			</div>
		</main>

		<footer class="mdf-slide__footer"></footer>
	</div>
</template>

<script lang="ts" src="./Preferences.ts"></script>

<style lang="scss" scoped>
@forward './Preferences';
</style>
