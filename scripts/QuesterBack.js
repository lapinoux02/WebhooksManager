module.exports = questerBack;

function questerBack() {
	const folder = '../QuesterBack';
	require('child_process').execSync(`cd ${folder} && git pull`);
}