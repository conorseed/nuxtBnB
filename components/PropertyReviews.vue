<template>
  <div class="app-padded-vertical">
    <div class="app-wrapper">
      <div class="app-testimonials">
        <div v-for="(review, index) in reviews" :key="review.reviewer.name+index">
          <div class="app-testimonial-header">
            <div><img :src="review.reviewer.image" :alt="review.reviewer.name" /></div>
            <div>
              <p class="app-testimonial-name">{{ review.reviewer.name }}</p>
              <p class="app-testimonial-date">{{ shortDate(review.date) }}</p> 
            </div>
          </div>
          <div class="app-testimonial-body">
            <app-short-text :text="review.comment" :target="100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import shortDate from '@/utils/shortDate'
export default{
  props:{
    reviews: {
      type: Array,
      required: true
    }
  },
  methods:{
    shortDate
  }
}
</script>

<style scoped>

</style>
