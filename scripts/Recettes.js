module.exports = recettesScript;

const fs = require('fs');
const folder = '../Recettes';
const execSync = require('child_process').execSync;

// Génère le fichier nav
let getNav = (subDirs) => {return `<nav><ul>
${subDirs.map(subDir => `<li><a href="[PATH]/${subDir}/index.html">${subDir}</a></li>`).join('\n')}
</ul></nav>`};


// Génère un fichier d'un sous dossier
let getSubIndex = (subDir, keyWords, fileLink, fileLinkTitle) => {return `# ${subDir}

${Object.keys(keyWords).map(keyWord => `## ${keyWord}

Consulter les recettes par [${fileLinkTitle}](./${fileLink})

${keyWords[keyWord].map(e => `* [${e.title}](./${e.file.replace('.md', '.html')})`).join('\n')}
`).join('\n')}`;
}

// Récupération des mots clé
let fetchKeyWord = (path, files, model, withoutModel) => {
	const keyWords = {};
	files.filter(file => file !== 'index.md' && file !== 'tags.md')
		.forEach(file => {
			const contentFile = fs.readFileSync(`${path}/${file}`).toString();
			const lines = contentFile.split('\n');
			const modelLine = lines.find(line => !line.indexOf(model));
			const title = lines[0].replace('# ', '').replace('\r', '');
			if (modelLine) {
				modelLine.replace(model, '').replace('\r', '').split(', ').forEach(keyWord => {
					if (keyWord) {
						if (keyWords[keyWord]) {
							keyWords[keyWord].push({file, title});
						} else {
							keyWords[keyWord] = [{file, title}];
						}
					} else if (withoutModel) {
						if (keyWords[withoutModel]) {
							keyWords[withoutModel].push({file, title});
						} else {
							keyWords[withoutModel] = [{file, title}];
						}
					}
				});
			} else if (withoutModel) {
				if (keyWords[withoutModel]) {
					keyWords[withoutModel].push({file, title});
				} else {
					keyWords[withoutModel] = [{file, title}];
				}
			}
	});

	return keyWords;
}

// Génération des fichiers html
let generateHtml = (path, fileName, relativePath) => {

	const header = fs.readFileSync(`${folder}/_html/header.html`).toString();
	const nav = fs.readFileSync(`${folder}/_html/nav.html`).toString();
	let link = `<link rel="stylesheet" type="text/css" href="${relativePath}/_css/style.css"/>`;

	execSync(`cd ${path} &&
			echo '${link}' > ${fileName}.html &&
			echo '${header.replace('[PATH]', relativePath)}' >> ${fileName}.html &&
			echo '${nav.replace('[PATH]', relativePath)}' >> ${fileName}.html &&
			echo '<div id="site_content">' >> ${fileName}.html &&
			markdown ${fileName}.md >> ${fileName}.html &&
			echo '</div>' >> ${fileName}.html`);
}


// Fonction principale
function recettesScript () {


	// Mise à jour du repo
	console.log(execSync(`cd ${folder} && git pull`).toString());

	// Suppression des html exceptés ceux qui sont dans des dossier commençant par ./_
	const generatedHtmlFiles = execSync(`cd ${folder} && find -regex "^\./[^_].*\.html"`).toString().split('\n').filter(name => name);
	generatedHtmlFiles.forEach(file => fs.unlinkSync(`${file.replace('./', `${folder}/`)}`));

	const subDirs = fs.readdirSync(folder).filter(name => !name.includes('.') && name[0] !== '_');

	// Génération du fichier nav.html
	fs.writeFileSync(`${folder}/_html/nav.html`, getNav(subDirs));

	// Génération des fichiers index.md subDirs
	subDirs.forEach(subDir => {
		const files = fs.readdirSync(`${folder}/${subDir}`).filter(file => file.includes('.md'));

		// Récupération des catégories
		const categories = fetchKeyWord(`${folder}/${subDir}`, files, 'Catégories : ', 'Non classé');

		// Récupération des tags
		const tags = fetchKeyWord(`${folder}/${subDir}`, files, 'Tags : ', 'Non taggé');

		fs.writeFileSync(`${folder}/${subDir}/index.md`, getSubIndex(subDir, categories, 'Tags', 'tags.html'));
		fs.writeFileSync(`${folder}/${subDir}/tags.md`, getSubIndex(subDir, tags, 'Catégories', 'index.html'));
	});

	// Génération des fichiers.html
	generateHtml(folder, 'index', '.');
	subDirs.forEach(subDir => {
		const files = fs.readdirSync(`${folder}/${subDir}`);
		files.forEach(fileExt => {
			const file = fileExt.replace('.md', '');
			generateHtml(`${folder}/${subDir}`, file, '..');
		})
	});
}