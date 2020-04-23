module.exports = mtgCounter;

function mtgCounter() {
	const folder = '../MtgCounter';
	require('child_process').execSync(`cd ${folder} && git pull`);
}