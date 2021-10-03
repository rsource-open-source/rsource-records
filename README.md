# rsource-records

```
                                                                          __
   ______________  __  _______________     ________  _________  _________/ /____
  / ___/ ___/ __ \/ / / / ___/ ___/ _ \   / ___/ _ \/ ___/ __ \/ ___/ __  / ___/
 / /  (__  ) /_/ / /_/ / /  / /__/  __/  / /  /  __/ /__/ /_/ / /  / /_/ (__  )
/_/  /____/\____/\__,_/_/   \___/\___/  /_/   \___/\___/\____/_/   \__,_/____/

```

<!--the font uses "slant"-->

![](https://img.shields.io/codefactor/grade/github/rsource-open-source/rsource-records/main?logo=codefactor&style=for-the-badge)

rsource-records is a TypeScript written Discord bot used to fetch content from the Roblox bhop & surf games via the [StrafesNET API](https://api.strafes.net/).
This aims to be a bot that has many more features than just an API fetcher in the future.
rsource-records uses the upcoming [detritus client](https://github.com/detritusjs/client) Discord API wrapper. 🎉🥳

**_This is still in its early development phase._**

Note: this project uses multiple branches, each are titled for their purpose. Our structure is `main`, `dev`, and `dev/*`, where `*` represents any.

[Project Board](https://github.com/orgs/rsource-open-source/projects/1)

Shortlink for this repository: https://rsource.rqft.space/bot/

## The Future

- DigitalOcean Droplet hosting
- Prisma and PostgreSQL
- Docker, maybe
- FFMPEG

## Setup

### Services

\*not in use yet

Requirements:

- [Node](https://nodejs.org/) v14/v16
- [Git](https://git-scm.com/)
- [Prisma](https://prisma.io/)\*
- [PostgreSQL](https://postgresql.org/)\*

What we use (optional services):

- Code editor/IDE: [VSCode](https://code.visualstudio.com/)
- Code loader: [nodemon](https://nodemon.io/)

### Setting up

Creating a local copy of this repository and running:

```bash
git clone https://github.com/rsource-open-source/rsource-records.git # creates repository locally
cd rsource-records
```

Now that we have the repository on our machine, let's populate it.

```bash
npm i # installs all dependencies
code .env # assuming you use vscode
```

Populate the `.env` and the `config.json` file with the applicable interfaces [here](https://github.com/rsource-open-source/rsource-records/blob/main/src/interfaces.ts) and the [.env.example](https://github.com/rsource-open-source/rsource-records/blob/main/.env.example) file.

After that, we can compile and run the code, here, we use nodemon to run out code everytime we save a file, **if you don't want to use nodemon** run the according:

```bash
tsc # compiles
# create a split/seperate terminal
node dist
```

Else:

```bash
tsc -w # compiles and watches for saves
# create a split/seperate terminal
nodemon dist
```
