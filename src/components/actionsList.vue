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
				<template v-if='org?.measures?.length > 1'>
					<ol>
						<li
							v-for='action of org?.measures'
							:key='action'
						>
							{{ action }}
						</li>
					</ol>
				</template>
				<template v-else>
					{{ org?.measures[0] }}
				</template>
			</li>
		</ul>
	</p>
</template>

<script>
export default {
	props: {
		actionsList: Array,
		showOneActionNumber: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
