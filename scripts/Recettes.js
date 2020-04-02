module.exports = recettesScript;

function recettesScript () {
	require('child_process').execSync(`sh bash/Recettes.sh`);
}