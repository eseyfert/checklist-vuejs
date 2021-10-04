import { defineComponent, markRaw } from 'vue';
import { Storage } from '../../storage';
import { ChecklistData } from '@/types';

import Input from '../Input/Input.vue';
import Dialog from '../Dialog/Dialog.vue';

interface AddData {
	checklistData: ChecklistData;
	components: unknown[];
	dialogUseKeyboard: boolean;
	inputsCount: number;
	isDialogActive: boolean;
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
			checklistData: this.data,
			components: [],
			inputsCount: 0,
			isDialogActive: false,
			dialogUseKeyboard: false,
			isDirty: false,
			storage: new Storage('checklist'),
			title: this.data.title,
		} as AddData;
	},
	components: { Input, Dialog },
	props: ['active', 'data'],
	emits: ['back', 'refresh', 'message'],
	methods: {
		insertInput(data?: Record<string, unknown>) {
			// Holds the input's component and data.
			const componentData = {
				component: markRaw(Input),
				focus: true,
				id: this.inputsCount + 1,
				value: '',
			};

			// Insert component.
			if (data) {
				this.components.push(data);
			} else {
				this.components.push(componentData);
			}

			// Update counter.
			this.inputsCount++;
		},
		removeInput(index: number) {
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

				// Set focus to the `Add task` button.
				(this.$refs.addTask as HTMLElement).focus();
			}
		},
		saveChanges(id: number) {
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
					// Create object holding the new checklist data.
					const updateData = {
						tasks: tasks,
						title: title,
					};

					// Create object holding final data.
					const finalData = Object.assign({}, this.checklistData, updateData);

					// Save the data to storage.
					this.storage.set(id.toString(), finalData).then(() => {
						this.$emit('back');
						this.$emit('refresh');
						this.$emit('message', 'Changes successfully saved');
					});
				}
			}
		},
		removeChecklist(id: number) {
			this.storage.delete(id.toString()).then(() => {
				this.$emit('back');
				this.$emit('refresh');
				this.$emit('message', 'Checklist successfully removed');
			});
		},
		titleChanged() {
			this.isDirty = true;
		},
		openDialog() {
			this.isDialogActive = true;
		},
		openKbDialog($event: KeyboardEvent) {
			if ($event.key === 'Enter' || $event.key === ' ') {
				// Open dialog with keyboard controls.
				$event.preventDefault();
				this.dialogUseKeyboard = true;
				this.openDialog();
			}
		},
		closeDialog() {
			this.isDialogActive = false;
		},
		confirmDialog(id: number) {
			this.isDialogActive = false;
			this.removeChecklist(id);
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
		dialogActive(): boolean {
			// Whether the dialog is active.
			return this.isDialogActive;
		},
		dialogKeyboard(): boolean {
			// Whether to use keyboard controls for the dialog.
			return this.dialogUseKeyboard;
		},
	},
	mounted() {
		this.$nextTick(() => {
			// Set focus on the title input.
			setTimeout(() => (this.$refs.titleInput as HTMLElement).focus(), 360);

			// Insert Input components for the already existing tasks.
			for (const task of this.data.tasks) {
				// Setup component data.
				const _data = {
					component: markRaw(Input),
					focus: false,
					id: this.inputsCount,
					value: task,
				};

				// Insert input component with supplied data.
				this.insertInput(_data);
			}
		});
	},
});
