<template>
	<div
		class='switcher'
		@click='switchMode'
	>
		<svg 
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 512 512'
		>
			<!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
			<path :d='spaceBody' />
		</svg>
	</div>
</template>

<script>
const sunPath = 'M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z';
const moonPath = 'M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z';

export default {
	data() {
		return {
			mode: 'light',
		};
	},
	computed: {
		spaceBody: function() {
			return this.mode === 'dark' ? moonPath : sunPath;
		},
	},
	created() {
		// retrieving mode from system settings
		let systemMode = this.isSystemDarkModeEnabled() ? 'dark' : 'light';

		// setting mode from localStorage or using system
		this.mode = localStorage.getItem('mode') ? localStorage.getItem('mode') : systemMode;

		// saving mode value to localStorage and document attributes
		localStorage.setItem('mode', this.mode);
		document.documentElement.setAttribute('data-mode', this.mode);
	},
	methods: {
		isSystemDarkModeEnabled() {
			return window.matchMedia('(prefers-color-scheme: dark)').matches;
		},
		switchMode() {
			this.mode = this.mode === 'light' ? 'dark' : 'light';

			localStorage.setItem('mode', this.mode);
			document.documentElement.setAttribute('data-mode', this.mode);
		},
	},
};
</script>

<style scoped>
.switcher {
	position: fixed;
	right: 2rem;
	top: 2rem;
	cursor: pointer;
	z-index: 100;
}

.switcher svg {
	height: 25px;
	fill: yellow;
	}
</style>
