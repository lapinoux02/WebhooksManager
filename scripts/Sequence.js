module.exports = photossScript;

function photossScript () {
	const folder = '../Sequence';
	require('child_process').execSync(`cd ${folder} && git pull`);
}