# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/StrongeLeeroy/hubcycle/compare/v1.0.0...v1.1.0) (2018-12-20)


### Features

* **configuration:** allow YAML configuration as alternative to JSON ([#8](https://github.com/StrongeLeeroy/hubcycle/issues/8)) ([6abc7b3](https://github.com/StrongeLeeroy/hubcycle/commit/6abc7b3))



<a name="1.0.0"></a>
# 1.0.0 (2018-12-19)

### Features

* implement ability to purge DockerHub image tags via JSON configuration
* allow multiple images per deployment with per-image "keep" and "expression" values
* add summary logs at task completion
* move debug and dry run settings to args