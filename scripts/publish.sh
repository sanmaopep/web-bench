cd ..

rush rebuild

rush version --bump

git add .

git commit -m "chore: Bump version"

rush publish --include-all -p