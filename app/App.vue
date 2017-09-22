

<template>
	<div class="container">
			<i class="fa fa-trash-o delete-screenshot-btn" 
				v-if="imgsToDelete.length" 
		 		v-on:click="deleteSelectedScreens"
				aria-hidden="true"></i>
		<div class="get-screenshot-holder">
			<button v-on:click="getScreenShots" class="get-screenshot-btn"> Get screenshots </button>
		</div>
		<div v-if="dataPresent" id="app">
			<h1> 
				{{data.numberOfFiles}} screenshots using {{data.sizeOfFiles}} space
			</h1>
			<div class="flexbox-col">
				<div class="col" v-for="img in this.data.images">
					<img
						:src="img.img" 
						v-on:click="getScreenShotSrc"
						:data-key="img.key"
						v-bind:class="{active: img.isActive, inActive: !img.isActive}"
						class="screenshot"> 
					</img>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const ipc = window.require('electron').ipcRenderer
	const deleteScreens = require('../delete-screens')
	
	export default {
		data() {
			return {
				counter: 0,
				data: {
					images: []
				},
				showImages: false,
				dataPresent: false,
				imgsToDelete: []
			}
		},
		/* eslint-disable object-shorthand */
		methods: {
			getScreenShots: function () {
				ipc.send('get-screenshots')
				ipc.on('screenshots-found', (event, imgs) => {
  				imgs.forEach(img => this.data['images'].push({isActive: false, key: 
  					Math.random().toString(16).slice(2), img}))
				})

				ipc.on('data', (event, data) => {
					this.data = Object.assign(this.data, data)
					this.dataPresent = true
				})
			},

			getScreenShotSrc: function(event) {
				let key = event.target.getAttribute('data-key')
				const images = this.data['images']
				let foundImg = images.findIndex(el => el.key == key)	
				if(foundImg > -1) {
					images[foundImg].isActive = !images[foundImg].isActive 
					if(images[foundImg].isActive) {
						let doesNotExistAlready = this.imgsToDelete.some(i => i.key == images[foundImg].key)
						if(!doesNotExistAlready) {
							this.imgsToDelete = this.imgsToDelete.concat(images[foundImg])
						}
					}
					else {
						let existsAlready = this.imgsToDelete.some(i => i.key == images[foundImg].key)	
						if(existsAlready) {
							this.imgsToDelete = this.imgsToDelete.splice(foundImg, 0)
						}
					}
				} 
			},

			changeShowImages: function() {
				this.showImages = !this.showImages
			}, 

			deleteSelectedScreens: function() {
				ipc.send('delete-screens', this.imgsToDelete)
				ipc.on('screens-removed', (event) => {
					this.imgsToDelete.length = 0
					this.data.images.length = 0
					this.getScreenShots()
				})
			}

		}
	}
</script>

<style>
	html {
		height: 100%;
	}
	body {
		display: flex;
		justify-content: center;
		height: 100%;
		background: #f9fafa;
	}
	.screenshot {
		width: 100px;
		height: 100px;
	}
	.flexbox-col {
		display: flex; 
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.flexbox-col .col {
		width: 30%;
	}
	.flexbox-col .col .active {
		background-color: blue;
		border: 10px;
	}
	.get-screenshot-holder {
		display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100% - 50px);
	}
	#app {
		display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
		font-family: Helvetica, sans-serif;
		display: flex;
	}
	button {
		align-self: center;
	}
	.get-screenshot-btn {
		border-radius: 4px;
    height: 32px;
    display: flex;
    border: 2px white solid;
    padding: 0 30px;
    text-align: center;
    align-items: center;
    color: white;
    justify-content: center;
		background: rgba(21, 149, 210, 0.9);
	}
	.delete-screenshot-btn {
		position: fixed;
    right: 0px;
    bottom: 10px;
	}
	.circle-container {
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;

	}
	p {
		color: white;
	}
	
	.container {
		/*overflow-y: scroll;*/
	}
	.logo {
		width: 100px;
		height: 100px
	}
</style>