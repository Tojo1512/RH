<template>
  <form @submit.prevent="handleSubmit" class="mb-4">
    <div v-for="(field, index) in fields" :key="index" class="mb-3">
      <label :for="field.name" class="form-label">{{ field.label }}</label>
      <input
        v-if="field.type !== 'select'"
        :type="field.type"
        :name="field.name"
        v-model="formData[field.name]"
        :placeholder="field.placeholder"
        class="form-control"
      />
      <select
        v-else
        :name="field.name"
        v-model="formData[field.name]"
        class="form-select"
      >
        <option v-for="option in field.options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary">{{ buttonText }}</button>
  </form>
</template>

<script>
export default {
  name: 'CrudForm',
  props: {
    fields: Array,
    buttonText: String,
    initialData: Object,
  },
  data() {
    return {
      formData: { ...this.initialData },
    };
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData);
    },
  },
};
</script>

<style scoped>
.mb-3 {
  margin-bottom: 1rem;
}
</style>
