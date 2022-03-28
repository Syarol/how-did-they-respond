<template>
	<ul class='categories-list'>
		<li
			v-for='item of filterOptions'
			:key='item'
			:title='item.name'
			:class='isActiveOne(item) ? "active" : ""'
			class='category'
			@click='toggleCategory($event, item)'
		>
			{{ item.emoji }}
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		activeOptions: Set,
		filterOptions: Array,
	},
	emits: [
		'toggle',
	],
	methods: {
		isActiveOne(item) {
			return this.activeOptions.has(item);
		},
		toggleCategory(e, item) {
			e.target.classList.toggle('active');

			this.$emit('toggle', item);
		},
	},
};
</script>
