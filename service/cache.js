
const Cache = {
  value: null,

  get() {
    return this.value;
  },

  set(n) {
    this.value = n;
  }
};

module.exports = Cache;