import { defineComponent } from 'vue';
import { Storage } from '../../storage';
import dayjs from 'dayjs';
import { ChecklistData } from '@/types';

interface ViewData {
	checklistData: ChecklistData;
	storage: Storage;
}

export default defineComponent({
	data() {
		return {
			checklistData: this.data,
			storage: new Storage('checklist'),
		} as ViewData;
	},
	props: ['active', 'data'],
	emits: ['back', 'refresh', 'message'],
	methods: {
		date(time: string): string {
			// Convert timestamp to date string showing month, day and year.
			return dayjs(time).format('MMM, DD YYYY');
		},
		time(time: string): string {
			// Convert timestamp to date string showing hours:minutes and AM/PM indicator.
			return dayjs(time).format('H:mm A');
		},
		completeTask(task: string) {
			// Store the completed tasks so far.
			const completedTasks = this.checklistData.done;

			// Get the index of the current task.
			const index = this.checklistData.tasks.indexOf(task);

			if (completedTasks.includes(task)) {
				// If the tasks is already complete, remove it from the array.
				completedTasks.splice(index, 1);
			} else {
				// Otherwise add it.
				completedTasks.push(task);
			}

			// Overwrite the completed tasks in our checklist data.
			this.checklistData.done = completedTasks;

			// Save the new data to storage.
			this.storage.set(this.checklistData.id.toString(), this.checklistData).then(() => {
				this.$emit('refresh');
			});
		},
		setAsComplete(id: number) {
			// Create object holding the new checklist data.
			const updateData = {
				complete: true,
				tasks: this.checklistData.done,
			};

			// Create object holding final data.
			const finalData = Object.assign({}, this.data, updateData);

			// Save the data to storage.
			this.storage.set(id.toString(), finalData).then(() => {
				this.$emit('back');
				this.$emit('refresh');
				this.$emit('message', 'Checklist set as complete');
			});
		},
	},
});
