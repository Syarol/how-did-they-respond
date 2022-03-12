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
	
	<p style='margin: 10px 0;'>Also, you can sort companies by industries:</p>

	<ul class='categories-list'>
		<li
			v-for='item of industries'
			:key='item'
			class='category'
			@click='toggleCategory($event, item)'
		>
			{{ item }}
		</li>
	</ul>

	<ul class='organizations-list'>
		<template v-if='searchText.length === 0 && activeCategories.size === 0'>
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
			<span>Sorry, but I can't find this company statement</span>
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
			Website: <a
				class='link'
				:href='activeOrganization.website'
			>link</a>
		</p>
		<p v-if='activeOrganization.side'>
			Sided with: {{ activeOrganization.side }}
		</p>
		<actionsList :actions-list='activeOrganization.actions.general'>Actions in general:</actionsList>
		<actionsList :actions-list='activeOrganization.actions.support'>Actions of support:</actionsList>
		<actionsList :actions-list='activeOrganization.actions.sanctions'>Sanctions and forced actions:</actionsList>
		<linksList :links-list='activeOrganization.links'>Links: </linksList>
	</section>
	<section class='info-section'>
		<h2 class='section-heading'>
			Didn't find someone?
		</h2>
		<p class='text-center'>
			We can't cover every company by ourselves, and we would be happy for your help. If you discovered a company that is declared its position about the current war or made some actions, please don't hesitate to create an issue for it on <a class='link' href='https://github.com/Syarol/how-did-they-respond'>GitHub</a> or add missing information by yourself by creating a pull request.
		</p>
	</section>
	<section class='info-section'>
		<h2 class='section-heading'>
			Want to help Ukraine?
		</h2>
		<p>There is plenty of organization that helps the Ukrainian army and refugees. If you can help financially, the fastest way for them to receive your help is to donate to local funds. There is some of them:</p>
		<ul>
			<li>
				The Come Back Alive Foundation: <a
					class='link'
					href='https://www.comebackalive.in.ua/'
				>link</a>
			</li>
			<li>
				Foundation of Serhii Prytula: <a
					class='link'
					href='https://www.prytula-co.org/'
				>link</a>
			</li>
			<li>
				Hospitallers: <a
					class='link'
					href='https://www.facebook.com/1554490484835854/posts/3152910124993874/'
				>link</a>
			</li>
			<li>
				Army SOS: <a
					class='link'
					href='https://armysos.com.ua/en'
				>link</a>
			</li>
			<li>
				<a
					class='link'
					href='https://en.wikipedia.org/wiki/National_Bank_of_Ukraine'
				>NBU</a> Special Account to Raise Funds for Ukraine's Armed Forces: <a
					class='link'
					href='https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi'
				>link</a>
			</li>
			<li>
				Volunteer Special Forces: Ivano–Frankivsk: <a
					class='link'
					href='https://purring-sceptre-959.notion.site/Volunteer-Special-Forces-Ivano-Frankivsk-458d4e959ec5441cae23ccc7a2570da6'
				>link</a>
			</li>
			<li>
				<a
					class='link'
					href='https://en.wikipedia.org/wiki/Ukrspetsexport'
				>Ukrspecexport</a> State Enterprise: <a
					class='link'
					href='https://ukroboronprom.com.ua/en/'
				>link</a>
			</li>
		</ul>
	</section>
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

import actionsList from './components/actionsList.vue';
import linksList from './components/linksList.vue';

export default {
	components: {
		actionsList,
		linksList,
	},
	data() {
		return {
			activeCategories: new Set(),
			activeOrganization: null,
			categorizedOrganizations: [],
			companies: companies.companies,
			industries: industries,
			organizations: [],
			searchText: '',
		};
	},
	methods: {
		searchCompany(){
			let activeCategories = Array.from(this.activeCategories);

			this.organizations = this.companies.filter(el => {
				let isFoundByName = el.name.toLowerCase().includes(this.searchText);
				let isFoundByAltName = isFoundByName ? null : el?.alt_name?.some(item => item.toLowerCase().includes(this.searchText));

				if (activeCategories.length > 0) {
					let isCategoriesApplied = el.industry.some(item => activeCategories.includes(item));

					return (isFoundByName && isCategoriesApplied) ||
						(isFoundByAltName && isCategoriesApplied);
				} else {
					return isFoundByName || isFoundByAltName;
				}
			});
		},
		toggleCategory(e, category){
			e.target.classList.toggle('active');

			if (this.activeCategories.has(category)) {
				this.activeCategories.delete(category);
			} else {
				this.activeCategories.add(category);
			}

			this.searchCompany();
		},
		selectOrganization(e){
			this.activeOrganization = e;
		},
	},
};
</script>

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

.organizations-list {
	column-gap: 10px;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	list-style: none;
	margin: 10px 10%;
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

.text-center {
	text-align: center;
}

.list {
	list-style: none;
	padding: 0 0 0 1em;
}
</style>
