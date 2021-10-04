import { defineComponent, markRaw } from 'vue';
import { Storage } from '../../storage';

import Input from '../Input/Input.vue';

interface AddData {
	components: unknown[];
	inputsCount: number;
	isDirty: boolean;
	storage: Storage;
	title: string;
}

const SELECTOR = {
	input: '.mdf-checklist-textfield .mdf-textfield__input',
};

export default defineComponent({
	data() {
		return {
			components: [markRaw(Input)],
			inputsCount: 1,
			isDirty: false,
			storage: new Storage('checklist'),
			title: '',
		} as AddData;
	},
	props: ['active'],
	emits: ['back', 'refresh', 'message'],
	methods: {
		insertInput(): void {
			// Insert component.
			this.components.push(markRaw(Input));

			// Update counter.
			this.inputsCount++;
		},
		removeInput(index: number): void {
			// Make sure at least 2 inputs exist.
			if (this.inputsCount > 1) {
				// Remove the given component.
				this.components.splice(index, 1);

				// Update counter.
				this.inputsCount--;

				// Make sure the count does not drop below 1.
				if (this.inputsCount < 1) {
					this.inputsCount = 1;
				}
			}
		},
		generateUUID(): number {
			// Set min and max values.
			const min = 0;
			const max = 8;

			// This will generate an Array holding different integers.
			const baseArray = window.crypto.getRandomValues(new Uint32Array(max));

			// We use this seed to pick a random number between the set min and the max range.
			const seed = Math.floor(Math.random() * (max - 1 - min) + min);

			// Select the UUID from the array.
			const uuid = baseArray[seed];

			// Return the UUID as an absolute value.
			return Math.abs(uuid + Date.now());
		},
		saveChecklist(): void {
			// Get the title input.
			const title = (this.$refs.titleInput as HTMLInputElement).value;

			if (title.length) {
				// Store all tasks in this array.
				const tasks: string[] = [];

				// Get all text inputs.
				const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll(SELECTOR.input);

				// Push the available input values to our array.
				for (const input of inputs) {
					if (input.value.length) {
						tasks.push(input.value);
					}
				}

				if (tasks.length) {
					// Generate unique ID for the checklist.
					const id = this.generateUUID();

					// Create object holding the new checklist data.
					const updateData = {
						complete: false,
						done: [],
						id: id,
						tasks: tasks,
						time: Date.now(),
						title: title,
					};

					// Save the data to storage.
					this.storage.set(id.toString(), updateData).then(() => {
						this.$emit('back');
						this.$emit('refresh');
						this.$emit('message', 'Checklist successfully added');
					});
				}
			}
		},
		titleChanged(): void {
			// Title has been touched.
			this.isDirty = true;
		},
	},
	computed: {
		getCount(): number {
			// Amount of created inputs.
			return this.inputsCount;
		},
		wasTouched(): boolean {
			// Whether or not the title input has been touched yet.
			return this.isDirty;
		},
	},
	mounted() {
		this.$nextTick(() => {
			// Set focus on the title input.
			setTimeout(() => (this.$refs.titleInput as HTMLElement).focus(), 360);
		});
	},
});
