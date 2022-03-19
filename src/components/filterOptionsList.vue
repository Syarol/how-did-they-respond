<template>
	<ul class='categories-list'>
		<li
			v-for='item of filterOptions'
			:key='item'
			class='category'
			@click='toggleCategory($event, item)'
		>
			{{ item }}
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		filterOptions: Array,
	},
	emits: [
		'toggle',
	],
	methods: {
		toggleCategory(e, item) {
			e.target.classList.toggle('active');

			this.$emit('toggle', item);
		},
	},
};
</script>
