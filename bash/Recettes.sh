cd ../Recettes
git pull --rebase
rm $(find -name '*.html')
find -name '*.md' | sed 's/\.md$//' | xargs -I {} echo "markdown {}.md > {}.html" | sh