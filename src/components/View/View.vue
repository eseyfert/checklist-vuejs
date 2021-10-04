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
				View your
				<strong>checklist.</strong>
			</h2>
		</header>

		<main class="mdf-slide__main">
			<div class="mdf-slide__content">
				<div class="mdf-checklist-header">
					<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
						<use href="/images/icons.svg#checklist"></use>
					</svg>

					<div class="mdf-checklist-header__content">
						<h6 class="mdf-checklist-header__title">{{ checklistData.title }}</h6>

						<span class="mdf-checklist-header__meta">
							Created {{ date(checklistData.time) }} at {{ time(checklistData.time) }} &mdash; Tasks left:
							{{ checklistData.tasks.length - checklistData.done.length }}
						</span>
					</div>
				</div>

				<ul class="mdf-checklist">
					<li v-for="task of checklistData.tasks" :key="task" class="mdf-checklist__item">
						<div class="mdf-control">
							<div class="mdf-checkbox">
								<input
									:id="`checkbox-${checklistData.tasks.indexOf(task) + 1}`"
									class="mdf-checkbox__input"
									type="checkbox"
									:checked="checklistData.done.includes(task) ? true : null"
									@input="completeTask(task)"
								/>

								<div class="mdf-checkbox__box">
									<svg class="mdf-checkbox__check" viewBox="0 0 24 24" aria-hidden="true">
										<use href="/images/icons.svg#checkbox"></use>
									</svg>
								</div>
							</div>

							<label
								:for="`checkbox-${checklistData.tasks.indexOf(task) + 1}`"
								:class="{ done: checklistData.done.includes(task) }"
							>
								{{ task }}
							</label>
						</div>
					</li>
				</ul>
			</div>
		</main>

		<footer class="mdf-slide__footer">
			<button
				class="mdf-button mdf-button--filled mdf-button--large mdf-button--leading-icon"
				@click="setAsComplete(data.id)"
			>
				<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
					<use href="/images/icons.svg#done"></use>
				</svg>

				Set as complete
			</button>
		</footer>
	</div>
</template>

<style lang="scss" scoped>
@forward './View.scss';
</style>

<script lang="ts" src="./View.ts"></script>
