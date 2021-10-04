import { defineComponent } from 'vue';
import { Storage } from '../../storage';
import { MDFTabs } from '@miraidesigns/tabs';
import { ChecklistData } from '../../types';
import dayjs from 'dayjs';

import Dialog from '../Dialog/Dialog.vue';

interface LandingData {
	complete: number;
	checklists: ChecklistData[];
	dialogId: number;
	dialogUseKeyboard: boolean;
	isDialogActive: boolean;
	open: number;
	storage: Storage;
}

export default defineComponent({
	data() {
		return {
			complete: 0,
			checklists: [],
			dialogId: 0,
			dialogUseKeyboard: false,
			isDialogActive: false,
			open: 0,
			storage: new Storage('checklist'),
		} as LandingData;
	},
	components: { Dialog },
	props: ['active', 'changes'],
	emits: ['refresh', 'add', 'edit', 'view', 'preferences', 'message'],
	methods: {
		populateData() {
			// Make sure the values are reset first.
			this.checklists = [];
			this.complete = 0;
			this.open = 0;

			// Push our stored checklist data to the array.
			this.storage.keys().then((keys) => {
				if (keys && keys.length) {
					for (const key of keys) {
						this.storage.get(key).then((data) => {
							// Push the checklist data to our data array.
							const _data = data as ChecklistData;
							this.checklists.push(_data);

							// Check if the checklist is open or complete and add to the respective counter.
							if (_data.complete) {
								this.complete++;
							} else {
								this.open++;
							}
						});
					}
				}
			});
		},
		initTabs() {
			// Use timeout to make sure DOM is ready.
			setTimeout(() => {
				// Look for the tabs container.
				const elem = document.querySelector('.mdf-tabs');

				if (elem) {
					// If the container exists, initialize the Tabs.
					new MDFTabs(elem);
				}
			}, 60);
		},
		date(time: string): string {
			// Convert timestamp to date string showing month, day and year.
			return dayjs(time).format('MMM, DD YYYY');
		},
		time(time: string): string {
			// Convert timestamp to date string showing hours:minutes and AM/PM indicator.
			return dayjs(time).format('H:mm A');
		},
		removeChecklist(id: number) {
			this.storage.delete(id.toString()).then(() => {
				this.$emit('refresh');
				this.$emit('message', 'Checklist successfully removed');
			});
		},
		openDialog(id: number) {
			this.isDialogActive = true;
			this.dialogId = id;
		},
		openKbDialog($event: KeyboardEvent, id: number) {
			if ($event.key === 'Enter' || $event.key === ' ') {
				$event.preventDefault();
				this.dialogUseKeyboard = true;
				this.openDialog(id);
			}
		},
		closeDialog(): void {
			this.isDialogActive = false;
		},
		confirmDialog(): void {
			this.isDialogActive = false;
			this.removeChecklist(this.dialogId);
		},
	},
	computed: {
		hasData(): boolean {
			return this.checklists.length > 0;
		},
		getData(): ChecklistData[] {
			return this.checklists;
		},
		openTasks(): number {
			return this.open;
		},
		completedTasks(): number {
			return this.complete;
		},
		dialogActive(): boolean {
			return this.isDialogActive;
		},
		dialogKeyboard(): boolean {
			return this.dialogUseKeyboard;
		},
	},
	watch: {
		changes: function () {
			this.populateData();
			this.initTabs();
		},
	},
	created() {
		this.populateData();
	},
	mounted() {
		this.$nextTick(() => {
			this.initTabs();
		});
	},
});
