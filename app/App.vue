<template>
	<div class="container">
			<i class="fa fa-trash-o delete-screenshot-btn" 
				:disabled="!imgsToDelete.length"
		 		v-on:click="deleteSelectedScreens"
				aria-hidden="true"></i>
			<div class="help-msg" v-if="imgsToDelete.length"> 
				{{msg}} 
			</div>
		<div class="get-screenshot-holder">
			<button v-on:click="getScreenshots" class="get-screenshot-btn"> Get screenshots </button>
		</div>
		<div v-if="images.length" id="app">
			<h1> 
				{{numberOfScreenShots}} screenshots using {{sizeOfScreenShots}} space
			</h1>
			<div class="flexbox-col">
        <button v-on:click="markAllAsDelete" class="mark-all-as-delete"> {{markAllAsDeleteText}} </button>
				<div class="col" v-for="img in images">
					<img
						:src="img.img" 
						v-on:click="addToDelete(img)"
						:data-key="img.key"
						v-bind:class="{active: img.delete, inActive: !img.delete}"
						class="screenshot"> 
					</img>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
  export default {
  	data: function() {
  		return {
  			msg: '',
  		}
  	},
    computed: { 
    ...mapGetters([
      'images',
      'imgsToDelete',
      'numberOfScreenShots',
      'markAllAsDeleteText',
      'sizeOfScreenShots'
    ])
  },
  methods: {
  	showMsg: function() {
    	if(imgsToDelete.length >= 1) {
    		msg = `${imgsToDelete}.length selected.`
    	}
    	else {
    		msg = 'Click on screenshot to select.'
    	}
    },
    ...mapActions([
      'getScreenshots',
      'deleteSelectedScreens',
      'markAllAsDelete',
      'addToDelete'
    ])
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
	.help-msg {
		color: white;
    background-color: #bdc3c7;
    width: 100%;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
    position: absolute;
    bottom: 1px;
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
		border: 10px solid red;
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
	.get-screenshot-btn, .mark-all-as-delete {
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
    font-size: 100px;	
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