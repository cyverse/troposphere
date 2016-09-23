DEBUG = false

# Get the commits before the merge
#   ex. heads = ["<latest commit of master>", "<previous commit of master>", ...]
heads = `git reflog -n 2 | awk '{ print $1 }'`.split

# Make sure our revision history has at least 2 entries
if heads.length < 2
    exit 0
end

files = `git diff --name-only #{heads[1]} #{heads[0]} | grep package.json`
diffFiles = `git diff --name-only #{heads[1]} #{heads[0]} | grep package.json | tr "\n" " "`
if diffFiles then
    default = "\e[0m"
    red = "\e[31m"
    puts "[#{red}package-json-warning.rb hook#{default}]: New JavaScript node_modules."
    puts "npm install"

    if DEBUG then
        # Print the diff with 0 lines of context
        puts `git diff -U0 #{heads[1]} #{heads[0]} -- #{diffFiles}`
    end
end
