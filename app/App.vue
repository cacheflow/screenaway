

<template>
	<div class="container">
		<button v-if="imgsToDelete.length" class="get-screenshot-btn"> 
			Delete images 
		</button>
		<div v-if="!dataPresent">
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
				ipc.send('screenshots-found')
				ipc.on('screenshots-found', (event, imgs) => {
					console.log(this)
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
		background: linear-gradient(#74ebd5, #ACB6E5);
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
		border-radius: 50%;
    border: 2px solid white;
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
	}
	.circle-container {
		border-radius: 50%;
    border: 2px solid white;
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