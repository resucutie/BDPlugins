const plugin = process.argv.slice(2)[0]
const watch = process.env.npm_config_watch ? "--watch" : ""
require('child_process').execSync(`npx bdbuilder --plugin="${plugin}" --production ${watch} --config=bdbuilder.dev.config.json`, {
    cwd: ".",
    stdio: "inherit"
})