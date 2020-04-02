module.exports = photossScript;

function photossScript () {
	require('child_process').execSync(`sh bash/Photoss.sh`);
}