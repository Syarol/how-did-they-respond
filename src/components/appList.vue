<template>
	<p v-if='actionsList'>
		<slot /> 
		<ul
			v-for='org of actionsList'
			:key='org.country'
			class='list'
		>
			<li>
				{{ org?.country }}
				<template v-if='org.country'>: </template>
				{{ org?.measures }}
			</li>
		</ul>
	</p>
</template>

<script>
export default {
	props: {
		actionsList: Array,
	},
};
</script>

<style>
.list {
	list-style: none;
	padding: 0 0 0 1em;
}
</style>
