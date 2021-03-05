module.exports = recettesVueJs;

function recettesVueJs() {
	const folder = '../Recettes-vuejs';
	require('child_process').execSync(`cd ${folder} && git pull`);
}