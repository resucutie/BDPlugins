const plugin = process.argv.slice(2)[0]
require('child_process').execSync(`npx bdbuilder --plugin="${plugin}" --config=bdbuilder.dev.config.json`, {
    cwd: ".",
    stdio: "inherit"
})