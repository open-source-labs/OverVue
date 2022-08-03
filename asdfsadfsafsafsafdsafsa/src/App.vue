<template>
	<div id="app">
		<div id="nav">
			<router-link to="/App" class = "componentLinks">App</router-link>
			<router-link to="/">HomeView</router-link>
			<router-link to="/Parent" class = "componentLinks">Parent</router-link>
			<router-view></router-view>
		</div>
	</div>
</template>

<style scoped>
.componentLinks {
    margin: auto;
    text-align: center;
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background: #cfd8dc;
    border: 1px solid black;
}


</style >