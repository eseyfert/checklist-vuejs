<template>
	<div class="mdf-checklist-textfield mdf-textfield">
		<input
			ref="textInput"
			class="mdf-textfield__input"
			type="text"
			:name="`task-${id}`"
			:value="value"
			placeholder="Enter your task..."
		/>

		<button class="mdf-button mdf-button--icon" aria-label="Remove task" @click="$emit('remove')">
			<svg class="mdf-icon" viewBox="0 0 24 24" aria-hidden="true">
				<use href="images/icons.svg#delete"></use>
			</svg>
		</button>
	</div>
</template>

<style lang="scss" scoped>
@use '~@miraidesigns/base';
@use '~@miraidesigns/fx';
@use '~@miraidesigns/helpers';
@use '~@miraidesigns/theme';
@use '~@miraidesigns/utils';

.#{base.$prefix}-checklist-textfield {
	display: flex;
	align-items: center;

	.#{base.$prefix}-textfield__input {
		@include helpers.margin(0 0 16px 0);
		@include helpers.padding(0 16px 8px 16px);
		@include fx.animation-standard(border-color, 200ms);

		background-color: transparent;
		font-size: utils.px2rem(20px);
		border-bottom: utils.px2rem(1px) solid var(--border, #{theme.prop('border')});
		border-radius: 0;

		&:hover {
			border-color: var(--border-hover, #{theme.prop('border-hover')});
			cursor: pointer;
		}

		&:focus {
			border-color: var(--brand, #{theme.brand()});
			border-width: utils.px2rem(2px);
		}
	}

	.#{base.$prefix}-button {
		align-self: flex-start;
	}
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: ['id', 'value', 'focus'],
	emits: ['remove'],
	mounted() {
		this.$nextTick(() => {
			const _input = this.$refs.textInput as HTMLElement;

			if (this.focus) {
				_input.scrollIntoView();
				_input.focus();
			}
		});
	},
});
</script>
