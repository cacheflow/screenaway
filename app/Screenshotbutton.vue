<template>
  <span> 
    <div class="get-screenshot-holder">
      <button v-on:click="getScreenshots" class="get-screenshot-btn"> Get screenshots </button>
    </div>
    <div v-if="showScreenshotNotFoundText" class="no-screenshots-msg"> No   Screenshots   Found 
    </div>
  </span>
</template>

<script>
  export default {
    name: 'screenshotbutton',
    props: ['getScreenshots', 'showScreenshotNotFoundText']
  }
</script> 

<style>
  .get-screenshot-btn {
    border-radius: 4px;
    height: 32px;
    display: flex;
    border: 2px white solid;
    padding: 0 30px;
    text-align: center;
    margin: 0 auto;
    color: white;
    background: rgba(21, 149, 210, 0.9);
  }
  .delete-screenshot-btn {
    font-size: 36px;
    color: black;
    display: block;
    transition: color 0.3s ease-in;
  }
  .delete-screenshot-btn:hover{
    color: red;
  }

</style>
