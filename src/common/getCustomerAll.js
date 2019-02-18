let allCustomerData = {
  methods: {
    getCustomerAll () {
      this.$axios.post('/api/medi/getCustomerAll').then(res => {
        if (res.data.data.length) {
          this.options = res.data.data
        }
      })
    }
  }
}
export default allCustomerData
