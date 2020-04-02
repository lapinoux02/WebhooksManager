cd ../Recettes
git pull --rebase
find -name '*.md' | sed 's/\.md$//' | xargs -I {} echo "markdown {}.md > {}.html" | sh