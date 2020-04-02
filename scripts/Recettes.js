module.exports = recettesScript;

const fs = require('fs');

// Génère le fichier index root
let getRootIndex = (subDirs) => {return `# Recettes

${subDirs.map(subDir => `* [${subDir}](./${subDir}) ([par tags](./${subDir}/tags.html))`).join('\n')}
`;
}

// Génère un fichier d'un sous dossier
let getSubIndex = (subDir, keyWords) => {return `# ${subDir}

${Object.keys(keyWords).map(keyWord => `## ${keyWord}

${keyWords[keyWord].map(e => `* [${e.title}](./${e.file.replace('.md', '.html')})`).join('\n')}
`).join('\n')}`;
}

// Récupération des mots clé
let fetchKeyWord = (path, files, model, withoutModel) => {
	const keyWords = {};
	files.forEach(file => {
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

// Fonction principale
function recettesScript () {
	const execSync = require('child_process').execSync;

	const folder = '../Recettes';

	// Mise à jour du repo
	console.log(execSync(`cd ${folder} && git pull`).toString());

	// Suppression des html exceptés ceux qui sont dans des dossier commençant par ./_
	const generatedHtmlFiles = execSync(`cd ${folder} && find -regex "^\./[^_].*\.html"`).toString().split('\n').filter(name => name);
	generatedHtmlFiles.forEach(file => fs.unlinkSync(`${file.replace('./', `${folder}/`)}`));

	const subDirs = fs.readdirSync(folder).filter(name => !name.includes('.') && name[0] !== '_');

	// Génération du fichier index.md root
	fs.writeFileSync(`${folder}/index.md`, getRootIndex(subDirs));

	// Génération des fichiers index.md subDirs
	subDirs.forEach(subDir => {
		const files = fs.readdirSync(`${folder}/${subDir}`).filter(file => file.includes('.md'));

		// Récupération des catégories
		const categories = fetchKeyWord(`${folder}/${subDir}`, files, 'Catégories : ', 'Non classé');

		// Récupération des tags
		const tags = fetchKeyWord(`${folder}/${subDir}`, files, 'Tags : ', 'Non taggé');

		fs.writeFileSync(`${folder}/${subDir}/index.md`, getSubIndex(subDir, categories));
		fs.writeFileSync(`${folder}/${subDir}/tags.md`, getSubIndex(subDir, tags));
	});

	// Génération des fichiers.html
	const header = fs.readFileSync(`${folder}/_html/header.html`).toString();
	let link = '<link rel="stylesheet" type="text/css" href="./_css/style.css"/>';
	console.log(`cd ${folder} && echo '${link}' > index.html && echo '${header.replace('[PATH]', '.')}' >> index.html && markdown index.md >> index.html`);
	execSync(`cd ${folder} && echo '${link}' > index.html && echo '${header.replace('[PATH]', '.')}' >> index.html && markdown index.md >> index.html`);
	subDirs.forEach(subDir => {
		link = '<link rel="stylesheet" type="text/css" href="../_css/style.css"/>'
		const files = fs.readdirSync(`${folder}/${subDir}`);
		files.forEach(fileExt => {
			const file = fileExt.replace('.md', '');
			execSync(`cd ${folder}/${subDir} && echo '${link}' > ${file}.html && echo '${header.replace('[PATH]', '..')}' >> ${file}.html && markdown ${file}.md >> ${file}.html`);
			console.log(`cd ${folder}/${subDir} && echo '${link}' > ${file}.html && echo '${header.replace('[PATH]', '..')}' >> ${file}.html && markdown ${file}.md >> ${file}.html`);
		})
	});
}