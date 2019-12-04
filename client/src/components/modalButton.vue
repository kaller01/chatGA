<template>
  <button type="button" class="btn btn-primary" data-toggle="modal" :data-target="'#modal'+id">
    Launch modal{{id}}
  </button>
</template>

<script>
    export default {
        name: "modalButton",
        props: {
            id: String
        }
    }
</script>

<style scoped>

</style>
