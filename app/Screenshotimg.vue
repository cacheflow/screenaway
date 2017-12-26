<template> 
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
</template>                