<template>
	<div>
		<h1 class='app-heading text-center'>
			<a
				class='link link--red'
				href='https://en.wikipedia.org/wiki/2022_Russian_invasion_of_Ukraine'
				style='font-weight: 800;'
			>24 February</a>,<br> after 8 years of semi-frozen war, russia🇷🇺 initiated a full-scale invasion of Ukraine🇺🇦. In addition to sanctions initiated by many countries, a lot of companies have their own response to war. Here, you can take a look at it
		</h1>
		<input 
			v-model='searchText' 
			class='search-field'
			type='text' 
			placeholder='Search...'
			@input='searchCompany'
		>
	</div>

	<div class='filters-container mx-10'>
		<span>Available filters:</span>
		<div class='filters-list'>
			<div class='filter'>
				<input type='checkbox' name='industry' id='industry' v-model='showIndustries' >
				<label for='industry'>Industry</label>
			</div>
			<div class='filter'>
				<input type='checkbox' name='country' id='country' v-model='showCountries' >
				<label for='country'>Country</label>
			</div>
		</div>
		<button 
			v-if='isFiltersApplied'
			class='clear-filters-btn'
			@click='clearFilters'
		>&#10060; Clear filters</button>
	</div>

	<div 
		v-if='showIndustries || showCountries'
		class='filters-options-container mb-10' 
	>
		<template v-if='showIndustries'>
			<simpleFilterOptionsList
				:filter-options='industries'
				:active-options='activeCategories'
				@toggle='toggleFilterOptionsList(activeCategories, $event)'
			/>
		</template>
	
		<template v-if='showCountries'>
			<filterOptionsList
				:filter-options='countries'
				:active-options='activeCountries'
				@toggle='toggleFilterOptionsList(activeCountries, $event)'
			/>
		</template>
	</div>

	<ul class='organizations-list'>
		<template v-if='searchText.length === 0 && activeCategories.size === 0 && activeCountries.size === 0'>
			<li
				v-for='org of companies.slice(0, 15)'
				:key='org.name'
				class='organization'
				@click='selectOrganization(org)'
			>
				{{ org.name }}
			</li>
		</template>
		<template v-else-if='organizations.length > 0'>
			<li
				v-for='org of organizations'
				:key='org.name'
				class='organization'
				@click='selectOrganization(org)'
			>
				{{ org.name }}
			</li>
		</template>
		<template v-else>
			<span class='text-center'>Sorry, but I can't find statements of such companies </span>
		</template>
	</ul>

	<section
		v-if='activeOrganization'
		class='info-section'
	>
		<h2 class='section-heading'>
			{{ activeOrganization.name }}
		</h2>
		<p>
			Website: <a class='link' :href='activeOrganization.website'>link</a>
		</p>
		<p v-if='activeOrganization.headquarters'>
			Headquarters: {{ activeOrganization.headquarters }}
		</p>
		<p v-if='activeOrganization?.brands?.length > 0'>
			Related companies and brands:  
			<ul class='brands-list'>
				<li v-for='brand of activeOrganization.brands' :key='brand' :class='isCompanyHasStatement(brand) ? "available-brand-container" : ""'>
					<template v-if='isCompanyHasStatement(brand)'>
						<span class='available-brand' @click='searchSpecificCompany(brand)'> {{ brand }} </span>
						<span class='available-brand-underline' />
					</template>
					<template v-else>
						{{ brand }}
					</template>
				</li>
			</ul>
		</p>
		<p v-if='activeOrganization.side'>
			Sided with: {{ activeOrganization.side }}
		</p>
		<actionsList :actions-list='activeOrganization.actions.general'>Actions in general:</actionsList>
		<actionsList :actions-list='activeOrganization.actions.support'>Actions of support:</actionsList>
		<actionsList :actions-list='activeOrganization.actions.sanctions'>Sanctions and forced actions:</actionsList>
		<linksList v-if='activeOrganization.links' :links-list='activeOrganization.links'>Links: </linksList>
	</section>
	<section class='info-section'>
		<h2 class='section-heading'>
			Didn't find someone?
		</h2>
		<p class='text-center'>
			We can't cover every company by ourselves, and we would be happy for your help. If you discovered a company that is declared its position about the current war or made some actions, please don't hesitate to create an issue for it on <a class='link' href='https://github.com/Syarol/how-did-they-respond'>GitHub</a> or add missing information by yourself by creating a pull request.
		</p>
	</section>
	<waysToSupportBlock />
	<section class='info-section'>
		<h3 class='section-heading'>
			Searching for another ways to help?
		</h3>
		<p class='text-center'>
			Share information about russians war crimes (not only in Ukraine), fight their propaganda and demand your government to <a
				class='link'
				href='https://twitter.com/hashtag/closethesky'
			>#CloseTheSky</a>
		</p>
	</section>
</template>

<script>
import companies from './companies.json';
import industries from './industries.json';
import countries from './countries.json';

import actionsList from './components/actionsList.vue';
import filterOptionsList from './components/filterOptionsList.vue';
import linksList from './components/linksList.vue';
import simpleFilterOptionsList from './components/simpleFilterOptionsList.vue';
import waysToSupportBlock from './components/waysOfSupportBlock.vue';

export default {
	components: {
		actionsList,
		filterOptionsList,
		linksList,
		simpleFilterOptionsList,
		waysToSupportBlock,
	},
	data() {
		return {
			activeCategories: new Set(),
			activeCountries: new Set(),
			activeOrganization: null,
			categorizedOrganizations: [],
			companies: companies.companies,
			countries: countries,
			industries: industries,
			organizations: [],
			searchText: '',
			showCountries: false,
			showIndustries: false,
		};
	},
	computed: {
		isFiltersApplied(){
			return this.activeCategories.size > 0 ||
				this.activeCountries.size > 0;
		},
	},
	created() {
		this.$watch(
			() => this.$route.params,
			() => {
				if (this.$route.params?.company) {
					this.searchSpecificCompany(this.$route.params?.company);
				}
			},
			{ 
				immediate: true,
			},
		);
	},
	methods: {
		isCompanyHasStatement(company){
			return this.companies.some(el => el.name === company);
		},
		async updatePath(company){
			await this.$router.push({
				name: 'app',
				params: {
					company,
				},
			});
		},
		searchSpecificCompany(company){
			this.activeOrganization = this.companies.find(el => el.name.toLowerCase() === company.toLowerCase());
			this.updatePath(this.activeOrganization.name);
		},
		searchCompany(){
			let activeCategories = Array.from(this.activeCategories);
			let activeCountries = Array.from(this.activeCountries);
			let query = this.searchText.toLowerCase();

			this.organizations = this.companies.filter(el => {
				let isFoundByName = el.name.toLowerCase().includes(query);
				let isFoundByAltName = isFoundByName ? null : el?.alt_name?.some(item => item.toLowerCase().includes(query));

				let isAnyCategorySelected = activeCategories.length > 0;
				let isAnyCountrySelected = activeCountries.length > 0;

				let isCategoriesApplied = isAnyCategorySelected ? el.industry.some(item => activeCategories.includes(item)) : null;
				let isCountriesApplied = isAnyCountrySelected ? activeCountries.some(item => el.headquarters.includes(item.emoji)) : null;

				if (isAnyCategorySelected && isAnyCountrySelected) {
					return (isFoundByName && isCategoriesApplied && isCountriesApplied) ||
						(isFoundByAltName && isCategoriesApplied && isCountriesApplied);
				} else if (isAnyCategorySelected && !isAnyCountrySelected) {
					return (isFoundByName && isCategoriesApplied) ||
						(isFoundByAltName && isCategoriesApplied);
				} else if (!isAnyCategorySelected && isAnyCountrySelected) {
					return (isFoundByName && isCountriesApplied) ||
						(isFoundByAltName && isCountriesApplied);
				} else {
					return isFoundByName || isFoundByAltName;
				}
			});
		},
		toggleFilterOptionsList(activeItemsList, filterOption){ 
			if (activeItemsList.has(filterOption)) {
				activeItemsList.delete(filterOption);
			} else {
				activeItemsList.add(filterOption);
			}

			this.searchCompany();
		},
		selectOrganization(e){
			this.activeOrganization = e;
			this.updatePath(this.activeOrganization.name);
		},
		clearFilters(){
			this.activeCategories.clear();
			this.activeCountries.clear();
		},
	},
};
</script>

<style src='./styles/utilities.css'></style>

<style>
*,
*::before,
*::after {
	box-sizing: border-box;
	margin: 0;
	position: relative;
	font-weight: normal;
}

body {
	min-height: 100vh;
	color: #2c3e50;
	background: #fff;
	line-height: 1.6;
	font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
		Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	font-size: 15px;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

@media (prefers-color-scheme: dark) {
	body {
		color: #fff;
		background: #181818;
	}
}

#app {
	align-items: center;
	display: flex;
	flex-direction: column;
	font-weight: normal;
	margin: 0 auto;
	max-width: 1280px;
	padding: 2rem;
}

a,
.link,
.link:visited {
	text-decoration: none;
	transition: 0.4s;
	color: #2a2cc3;
}

@media (prefers-color-scheme: dark) {
	.link,
	.link:visited {
		color: #b5b51b;
	}
}

.link--red,
.link--red:visited {
	color: #bd0000;
}

.link--red:hover {
	background-color: #bd000033;
}

input[type=checkbox] {
	display: none;
}

.search-field {
	background: #00000020;
	border-bottom: 2px solid #7f7f7f;
	border: 0;
	color: #000;
	font-size: 2.5em;
	height: 60px;
	margin-top: 20px;
	text-align: center;
	width: 100%;
}

@media screen and (max-width: 480px) {
	.search-field {
		height: 40px;
	}
}

@media screen and (max-width: 720px) {
	.app-heading {
		font-size: 20px;
	}

	.search-field {
		height: 50px;
		font-size: 1.5em;
	}
}

@media (prefers-color-scheme: dark) {
	.search-field {
		background: #ffffff0d;
		color: #7f7f7f;
	}
}

.filters-container {
	display: flex;
	column-gap: 10px;
	flex-wrap: wrap;
	justify-content: center;
	row-gap: 5px;
}

.filters-list {
	display: inline-flex;
	gap: 10px;
}

.filter label{
	border-radius: 15px;
	border: 1px solid #f5f51f;
	cursor: pointer;
	display: inline-block;
	padding: 0 7px;
}

.filter input[type='checkbox']:checked + label {
	background: #f5f51f;
	color: #181818;
}

.filters-options-container {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.clear-filters-btn {
	background: transparent;
	border: 0;
	color: #2c3e50;
	cursor: pointer;
	font-family: inherit;
	font-size: 15px;
	padding: 0;
}

@media (prefers-color-scheme: dark) {
	.clear-filters-btn {
		color: #fff;
	}
}

.organizations-list {
	column-gap: 10px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	list-style: none;
	margin: 0 10% 10px 10%;
	padding: 0;
	row-gap: 5px;
}

.organization {
	cursor: pointer;
}

.organization:hover {
	color: #000;
}

@media (prefers-color-scheme: dark) {
	.organization:hover {
		color: #ebebeb;
	}
}

.categories-list {
	column-gap: 10px;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: center;
	list-style: none;
	margin: 0 10%;
	padding: 0;
	row-gap: 5px;
}

@media screen and (max-width: 480px) {
	.categories-list {
		margin: 0 10px;
	}
}

.category {
	border: 1px solid #f5f51f;
	padding: 0 7px;
	border-radius: 15px;
	cursor: pointer;
}

.category.active {
	background: #f5f51f;
	color: #181818;
}

.info-section {
	background: #00000020;
	margin: 20px 0;
	max-width: 800px;
	padding: 30px 15px;
}

@media (prefers-color-scheme: dark) {
	.info-section {
		background: #ffffff0d;
	}
}

.section-heading {
	font-weight: 500;
	text-align: center;
	margin-bottom: 5px;
}

.list {
	list-style: none;
	padding: 0 0 0 1em;
}

.brands-list {
	column-gap: 8px;
	display: inline-flex;
	flex-wrap: wrap;
	list-style: none;
	padding: 0;
	row-gap: 2px;
}

.available-brand-container {
	cursor: pointer;
	position: relative;
}

.available-brand-container > .available-brand {
	padding: 0 2px;
	position: relative;
	transition: 1s ease;
	z-index: 2;
}

.available-brand-container:hover > .available-brand {
	color: #242424;
}

.available-brand-container > .available-brand-underline {
	width: 100%;
}

.available-brand-container:hover > .available-brand-underline {
	height: 100%;
}

.available-brand-underline {
	background-color: #eaea1b;
	bottom: 0;
	display: inline-block;
	height: 2px;
	left: 0;
	position: absolute;
	transition: .5s ease-in-out;
	z-index: 1;
}
</style>
