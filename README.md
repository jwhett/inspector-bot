## Inspector


**Preparation**

1. You'll need this source code either from a
   [release](https://github.com/jwhett/inspector-bot/releases) or from a `git clone`.
1. [Node.js](www.nodejs.org) v12.10.0
1. Within the directory of the source, run `npm i` to install dependencies.
1. Make copies of the `tempalte-*.json` files without `template-` in the name
   and configure them to your needs (change emoji, add authorized users, add
   bot token).
   
**Run the bot**

Run the bot with `npm run bot`

**Commands**

Bot commands are limited to only those users listed in `config.json`.

`?status` - DM the status of the bot to the caller.
`?report` - Report inspection statistics to the caller.
