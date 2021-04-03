module.exports = recettesVueJs;

function recettesVueJs() {
	const folder = '../Recettes-vuejs';
	
	require('child_process').execSync(`cd ${folder} && git fetch && git reset --hard origin/master`);
}