require('child_process').execSync(`npx bdbuilder --plugin="${process.argv.slice(2)[0]}" --production ${process.env.npm_config_watch ? "--watch" : ""} --config=bdbuilder.dev.config.json`, {
    cwd: ".",
    stdio: "inherit"
})