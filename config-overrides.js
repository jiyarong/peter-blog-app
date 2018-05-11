const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireMobX = require('react-app-rewire-mobx');
const p5 = require('./themes/p5')

module.exports = function override(config, env) {
	config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config);
	config = rewireLess.withLoaderOptions({
		modifyVars: p5
  })(config, env);
	config = rewireMobX(config, env);

	// console.log('----', config)
	// config.output.filename = 'http://assets.peteji.cn/js/[name].[chunkhash:8].js'
	// config.output.publicPath = './'

	return config;
};