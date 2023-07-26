module.exports = quester;

function quester() {
	const folder = '../Quester';
	require('child_process').execSync(`cd ${folder} && git pull`);
}