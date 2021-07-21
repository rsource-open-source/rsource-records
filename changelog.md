# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.0.3 - 2021-07-21
### Added
- [`CommandInterface.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/interfaces/CommandInterface.ts), added `guildOnly` boolean type.
- [`github.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/commands/github.ts), added `guildOnly` boolean.
- [`ping.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/commands/ping.ts), added `guildOnly` boolean.
- [`index.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/index.ts), added guild only responses, however, this won't be in effect until issue [#3](https://github.com/rsource-open-source/rsource-records/issues/3) is solved.

## v0.0.2 - 2021-07-20
### Added
- Dynamic file loading in [`index.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/index.ts)
- [`github.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/commands/github.ts)
- [prisma](https://github.com/rsource-open-source/rsource-records/blob/main/package.json#L21), not implemented.
- [`ConfigInterface.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/interfaces/CommandInterface.ts)
- [`changelog.md`](https://github.com/rsource-open-source/rsource-records/blob/main/changelog.md)

### Changed
- [`ping.ts`](https://github.com/rsource-open-source/rsource-records/blob/main/src/commands/ping.ts), added more in depth stuff.
- [`config.json`](https://github.com/rsource-open-source/rsource-records/blob/main/config.json), added shout.

### Removed 
- [`package-lock.json`](https://github.com/rsource-open-source/rsource-records/blob/main/src/package.json) in `main/src`.
- `help.ts`, will work on this later.