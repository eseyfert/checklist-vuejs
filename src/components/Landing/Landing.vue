<template>
	<div class="mdf-slide" :tabindex="!active ? '-1' : null">
		<header class="mdf-slide__header">
			<h2 class="mdf-slide__title">Thoughts.</h2>

			<div class="mdf-slide__controls">
				<button class="mdf-button mdf-button--icon" aria-label="Show app options" @click="$emit('preferences')">
					<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
						<use href="/images/icons.svg#controls" />
					</svg>
				</button>
			</div>
		</header>

		<main class="mdf-slide__main">
			<div class="mdf-slide__content" :class="{ 'mdf-slide__content--top': hasData }">
				<template v-if="hasData">
					<div class="mdf-tabs">
						<div class="mdf-tabs__bar mdf-tabs__bar--left">
							<button class="mdf-tabs__tab mdf-tabs__tab--selected" role="tab" aria-selected="true">
								<span class="mdf-tabs__content">
									<span class="mdf-tabs__text">Open ({{ openTasks }})</span>
								</span>

								<span class="mdf-tabs__selection"></span>
							</button>

							<button class="mdf-tabs__tab" role="tab" aria-selected="false" tabindex="-1">
								<span class="mdf-tabs__content">
									<span class="mdf-tabs__text">Complete ({{ completedTasks }})</span>
								</span>

								<span class="mdf-tabs__selection"></span>
							</button>
						</div>

						<div class="mdf-tabs__panels">
							<div class="mdf-tabs__panel mdf-tabs__panel--active" role="tabpanel" tabindex="0">
								<h5 v-if="openTasks === 0" style="margin-top: 2rem; text-align: center">
									Seems like you have no open checklists right now.
									<br />
									Why not add one?
								</h5>

								<ul class="mdf-checklist-list">
									<template v-for="data of getData" :key="data.id">
										<li class="mdf-checklist-list__item" v-if="!data.complete">
											<button
												class="mdf-button mdf-button--icon"
												aria-label="View checklist"
												@click="$emit('view', data)"
											>
												<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
													<use href="/images/icons.svg#checklist"></use>
												</svg>
											</button>

											<div class="mdf-checklist-list__item-content" @click="$emit('view', data)">
												<h6 class="mdf-checklist-list__item-title">
													{{ data.title }}
												</h6>

												<span class="mdf-checklist-list__item-meta">
													Created
													{{ date(data.time) }}
													at
													{{ time(data.time) }}
													&mdash; Tasks left:
													{{ data.tasks.length - data.done.length }}
												</span>
											</div>

											<button
												class="mdf-button mdf-button--icon"
												aria-label="Edit task"
												@click="$emit('edit', data)"
											>
												<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
													<use href="/images/icons.svg#edit"></use>
												</svg>
											</button>
										</li>
									</template>
								</ul>
							</div>

							<div class="mdf-tabs__panel" role="tabpanel" tabindex="0">
								<ul class="mdf-checklist-list">
									<template v-for="data of getData" :key="data.id">
										<li
											class="mdf-checklist-list__item mdf-checklist-list__item--complete"
											v-if="data.complete"
										>
											<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
												<use href="/images/icons.svg#done"></use>
											</svg>

											<div class="mdf-checklist-list__item-content">
												<h6 class="mdf-checklist-list__item-title">
													{{ data.title }}
												</h6>

												<span class="mdf-checklist-list__item-meta">
													Created
													{{ date(data.time) }}
													at
													{{ time(data.time) }}
													&mdash; Tasks left:
													{{ data.tasks.length - data.done.length }}
												</span>
											</div>

											<button
												class="mdf-button mdf-button--icon"
												aria-label="Remove checklist"
												@click="openDialog(data.id)"
												@keydown="openKbDialog($event, data.id)"
											>
												<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
													<use href="/images/icons.svg#delete"></use>
												</svg>
											</button>
										</li>
									</template>
								</ul>
							</div>
						</div>
					</div>

					<button
						id="add-checklist"
						class="mdf-button mdf-button--filled mdf-button--icon"
						aria-label="Add another checklist"
						@click="$emit('add')"
					>
						<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
							<use href="/images/icons.svg#add"></use>
						</svg>
					</button>
				</template>
				<template v-else>
					<div id="landing">
						<p id="landing-heading">
							Welcome to
							<strong>Thoughts.</strong>
							<br />
							<span>A simple and elegant checklist app that helps you stay organized.</span>
						</p>

						<button class="mdf-button mdf-button--filled mdf-button--large" @click="$emit('add')">
							Get started now
						</button>
					</div>
				</template>
			</div>
		</main>

		<footer class="mdf-slide__footer">
			<span class="mdf-copyright">
				App lovingly created by
				<a href="https://miraidesigns.net/" target="_blank">Mirai Designs</a>
			</span>
		</footer>
	</div>

	<Dialog
		v-if="dialogActive"
		:title="'Delete checklist'"
		:message="'Are you sure you want to delete this checklist?'"
		:active="dialogActive"
		:keyboard="dialogKeyboard"
		@cancel="closeDialog"
		@confirm="confirmDialog"
	></Dialog>
</template>

<script lang="ts" src="./Landing.ts"></script>

<style lang="scss" scoped>
@forward './Landing';
</style>
