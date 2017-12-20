<template>
    <div>
    <screenshotbutton
     :getScreenshots="getScreenshots"
     :showScreenshotNotFoundText="showScreenshotNotFoundText"
    >
    </screenshotbutton>
    <div class="help-msg" v-if="imgsToDelete.length">
      {{msg}}
    </div>
    <div class="sub-container">
      <section class="blog-post-wrap medium-padding80">
        <div v-if="images.length" id="app">
          <button v-on:click="markAllAsDelete" class="mark-all-as-delete"> {{selectAllScreenShots ? 'Unselect All' : 'Select All To Delete'}} </button>
           <h1>
            {{numberOfScreenShots}} screenshots using {{sizeOfScreenShots}} space
          </h1>
          <div v-if="selectAllScreenShots">
            <button v-on:click="deleteAllScreenShots" class="mark-all-as-delete"> Delete all screenshots </button>
          </div>
        </div>
        <div class="container">
          <div class="row sorting-container" id="posts-grid-1" data-layout="masonry">
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12 sorting-item community" v-for="img in images">
                <div class="ui-block">
                  <article class="hentry blog-post blog-post-v2">
                    <div class="post-thumb">
                      <img
                        :src="img.img"
                        :data-key="img.key"
                        v-bind:class="{active: img.delete, inActive: !img.delete}"
                        class="screenshot">
                      </img>
                      <i class="fa fa-trash-o delete-screenshot-btn"
                        v-on:click="deleteSelectedScreenShot(img.key)"
                        aria-hidden="true">
                      </i>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
      </section> 
    </div>
  </div>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex'
  import Screenshotbutton from './Screenshotbutton.vue'


  export default {
    components: {
      Screenshotbutton
    },
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
      'showScreenshotNotFoundText',
      'selectAllScreenShots',
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
      'deleteAllScreenShots',
      'deleteSelectedScreenShot',
      'markAllAsDelete'
    ])
  }
}
</script>

<style>
  #app {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  h1 {
    font-size: 40px;
    margin-top: 100px;
  }
	button {
		align-self: center;
	}
  .sub-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
	.mark-all-as-delete {
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
    font-size: 20px;
    color: black;
	}

</style>
