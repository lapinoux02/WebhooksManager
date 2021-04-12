module.exports = ifiScript;

function ifiScript () {
	const folder = '../IFI';
	
	require('child_process').execSync(`cd ${folder} && git fetch && git reset --hard origin/main`);
}