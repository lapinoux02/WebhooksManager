module.exports = webhooksManagerScript;

function webhooksManagerScript () {
	const execSync = require('child_process').execSync;
	require('child_process').execSync(`sh bash/WebhooksManager.sh`);
}