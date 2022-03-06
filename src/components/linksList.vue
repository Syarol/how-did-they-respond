<template>
	<p>
		<slot />
		<ol>
			<template
				v-for='link of linksList'
				:key='link'
			>
				<li>
					<a 
						:href='link'
						class='link'
					> 
						{{ link }}
					</a>
				</li>
			</template>
		</ol>
	</p>	
</template>

<script>
export default {
	props: {
		linksList: Array,
		showOneLinkNumber: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
