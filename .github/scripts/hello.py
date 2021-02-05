print("hello world")

readme_file = './README.md'

with open(readme_file, 'w') as newfile:
  newfile.write("This is the readme")
  newfile.close()
