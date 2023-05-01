module.exports = mtgCounter;

function mtgCounter() {
	const folder = '../PMBack.js';
	require('child_process').execSync(`cd ${folder} && git pull`);
}