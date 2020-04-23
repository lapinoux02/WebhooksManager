module.exports = webhooksManagerScript;

function webhooksManagerScript () {
	require('child_process').execSync(`sh bash/WebhooksManager.sh`);
}