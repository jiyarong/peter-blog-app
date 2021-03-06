const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireMobX = require('react-app-rewire-mobx');
const p5 = require('./themes/p5')

module.exports = function override(config, env) {
	config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
	config = rewireLess.withLoaderOptions({
		// modifyVars: p5
  })(config, env);
	config = rewireMobX(config, env);

	return config;
};