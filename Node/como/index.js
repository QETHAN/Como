
var como = {
	'core': require('./lib/core'),

	'array': require('./lib/array'),

	'class': require('./lib/class'),

	'date': require('./lib/date'),

	'file': require('./lib/file'),

	'http': require('./lib/http'),

	'log': require('./lib/log'),

	'string': require('./lib/string'),

	'validate': require('./lib/validate');
};

como.core.extend(como, como.core);

module.exports = como;