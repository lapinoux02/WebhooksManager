module.exports = mtgCounter;

function mtgCounter() {
	const folder = '../PMFront';
	require('child_process').execSync(`cd ${folder} && git pull`);
}