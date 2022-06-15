module.exports = {
  devServer: {
    proxy: {
      '/api': 'domain.com',
    },
  },
};
