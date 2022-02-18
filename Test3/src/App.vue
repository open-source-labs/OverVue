<template>
	<div id="app">
		<div id="nav">
			<router-link to="/">HomeView</router-link>
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2C3E50;
	margin-top: 60px;
}
</style>