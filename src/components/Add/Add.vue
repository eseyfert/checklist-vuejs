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
						<use href="/images/icons.svg#arrow-keyboard"></use>
					</svg>
				</button>
			</div>

			<h2 class="mdf-slide__title">
				Write your
				<strong>checklist.</strong>
			</h2>
		</header>

		<main class="mdf-slide__main">
			<div class="mdf-slide__content">
				<div
					class="mdf-textfield mdf-textfield--has-helper"
					:class="{
						'mdf-textfield--state-error': wasTouched && !title.length,
					}"
				>
					<input
						ref="titleInput"
						class="mdf-textfield__input"
						id="checklist-title"
						type="text"
						name="title"
						placeholder="Enter checklist title..."
						required
						v-model="title"
						@change="titleChanged()"
					/>

					<div class="mdf-textfield__helper-line" v-if="wasTouched && !title.length">
						<span class="mdf-textfield__helper">The title can't be empty</span>
					</div>
				</div>

				<component
					v-for="(component, index) in components"
					:key="index"
					:is="component"
					:id="index + 1"
					:focus="index > 0 ? true : false"
					@remove="removeInput(index)"
				/>

				<button
					id="add-input"
					class="mdf-button mdf-button--filled mdf-button--leading-icon"
					@click="insertInput()"
				>
					<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
						<use href="/images/icons.svg#add"></use>
					</svg>

					Add another task
				</button>
			</div>
		</main>

		<footer class="mdf-slide__footer">
			<button class="mdf-button mdf-button--filled mdf-button--large" @click="saveChecklist()">
				Save checklist
			</button>
		</footer>
	</div>
</template>

<style lang="scss" scoped>
@forward './Add';
</style>

<script lang="ts" src="./Add.ts"></script>
