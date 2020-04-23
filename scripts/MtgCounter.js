module.exports = mtgCounter;

function() mtgCounter {
	const folder = '../MtgCounter';
	console.log(execSync(`cd ${folder} && git pull`).toString());
}