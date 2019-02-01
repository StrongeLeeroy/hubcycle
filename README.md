[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.1.0-yellow.svg)](https://conventionalcommits.org)
[![CircleCI](https://circleci.com/gh/StrongeLeeroy/hubcycle/tree/master.svg?style=svg)](https://circleci.com/gh/StrongeLeeroy/hubcycle/tree/master)


Currently, only **private** DockerHub registries are supported. This application is distributed as a Docker image.

[Docker Hub](https://hub.docker.com/r/strongeleeroy/hubcycle)  |  [Changelog](https://github.com/StrongeLeeroy/hubcycle/blob/master/CHANGELOG.md)

## Getting Started

The quickest way to get started is opening the [sample-configuration](https://github.com/StrongeLeeroy/hubcycle/tree/master/sample-configuration) directory and running *Hubcycle* via Docker Compose or Kubernetes. You can also pull and run this image standalone:

```shell
docker pull strongeleeroy/hubcycle
```

---

## Configuration -- Environment variables

### Authentication

- **dockerhub.username:** DockerHub username.
- **dockerhub.password:** DockerHub password.

---

## Configuration -- Flags

The following flags can be passed as part of the docker compose`command` or Kubernetes container `args` options of the container:

- **--debug, -d:** Enable debug level logging.
- **--dry-run:** Enable dry run mode (no tags will be deleted).
- **--yaml:** Use YAML configuration instead of JSON.

*Docker compose example:*
```yaml
services:
  hubcycle:
    image: hubcycle:latest
    command: --dry-run --debug
```

*Kubernetes example:*
```yaml
spec:
  containers:
    - name: hubcycle
      image: hubcycle:latest
      args: ["--dry-run", "--debug"]
```

---


## Configuration -- Lifecycle Rules (JSON configuration)

Image match and purging configuration is read from a single file located under `/config/images.json`, if none is given, tthe application defaults to legacy configuration (via environment variables and documented at the end of this README file).

This file can be shared to the container via a volume or configuration map.

The configuration file `images.json` must contain an array of images with their own configuration parameters.

### Example A: Basic configuration
This configuration handles two images, a single tag matcher for `image-a`, and two tag matchers for `image-b`.

```json
{
  "images": [
    {
      "name": "user/image-a",
      "match": [
        {
          "expression": "develop-.*",
          "keep": 3
        }
      ]
    }, {
      "name": "user/image-b",
      "match": [
        {
          "expression": "develop-.*",
          "keep": 3
        }, {
          "expression": "master-.*",
          "keep": 10
        }
      ]
    }
  ]
}
```

### Example B: Setting defaults
We can set the default value of `keep` by setting a `keep` key on the image object instead of a matcher. If no `keep` value is given to a matcher or image, the system will default to 5.

In this example, `image-a` will use a `keep` value of 5 in the first matcher, `image-b` will use a `keep` value of 3 for the first matcher and default to 10 for the second.

```json
{
  "images": [
    {
      "name": "user/image-a",
      "match": [
        {
          "expression": "develop-.*"
        }
      ]
    }, {
      "name": "user/image-b",
      "keep": 10,
      "match": [
        {
          "expression": "develop-.*",
          "keep": 3
        }, {
          "expression": "master-.*"
        }
      ]
    }
  ]
}
```

### Example C: Shortcut syntax
We can use a slightly more compact syntax when we only need to handle a single matcher per image by using a string instead of a matcher array. Defaults behave in the same manner, `image-a` below will use a `keep` value of 5 (default) while `image-b` will use 10 (user set).

```json
{
  "images": [
    {
      "name": "user/image-a",
      "match": "develop-.*"
    }, {
      "name": "user/image-b",
      "keep": 10,
      "match": "master-.*"
    }
  ]
}
```

## Configuration -- Lifecycle Rules (YAML)

**YAML configuration** is the preferred alternative to JSON (which will eventually be deprecated). Image match and purging configuration can be read from a single file located under `/config/images.yaml`, if none is given, tthe application defaults to legacy configuration (via environment variables and documented at the end of this README file).

This file can be shared to the container via a volume or configuration map.

Using YAML configuration requires that the `--yaml` flag is passed as an argument to the Node application or container.

### Example A: Basic configuration
This configuration handles two images, a single tag matcher for `image-a`, and two tag matchers for `image-b`.

```yaml
images:
  - name: user/image-a
    match:
    - expression: develop-.*
      keep: 3
  - name: user/image-b
    match:
    - expression: develop-.*
      keep: 3
    - expression: master-.*
      keep: 10
```

### Example B: Setting defaults
We can set the default value of `keep` by setting a `keep` key on the image object instead of a matcher. If no `keep` value is given to a matcher or image, the system will default to 5.

In this example, `image-a` will use a `keep` value of 5 in the first matcher, `image-b` will use a `keep` value of 3 for the first matcher and default to 10 for the second.

```yaml
images:
  - name: user/image-a
    match:
    - expression: develop-.*
  - name: user/image-b
    keep: 10
    match:
    - expression: develop-.*
      keep: 3
    - expression: master-.*
```

### Example C: Shortcut syntax
We can use a slightly more compact syntax when we only need to handle a single matcher per image by using a string instead of a matcher array. Defaults behave in the same manner, `image-a` below will use a `keep` value of 5 (default) while `image-b` will use 10 (user set).

```yaml
images:
  - name: user/image-a
    match: develop-.*
  - name: user/image-b
    keep: 10
    match: master-.*
```

---

## Legacy Configuration -- Environment variables (DEPRECATED)

- **dockerhub.organization:** DockerHub organization.
- **dockerhub.images:** List of comma separated image repository names. (e.g.: image1,image2)
- **match.expression:**: RegExp expression that will be used to detect matching tags *[default: develop-.\*]*.
- **keep:** Number of old builds to keep (from those matching the expression above).

The complete image registry path is generated by merging the *dockerhub.organization* and *dockerhub.images* variables, and then matched to a tag using *match.expression*. For example, given the following values:

- *dockerhub.organization:* mycompany
- *dockerhub.images:* my-image,my-other-image,my-third-image
- *match.expression:* develop-.\*

These would be a few matching tags:

```
mycompany/my-image:develop-001
mycompany/my-image:develop-002
mycompany/my-image:develop-123abc
mycompany/my-other-image:develop-001
mycompany/my-other-image:develop-002
mycompany/my-other-image:develop-123abc
mycompany/my-third-image:develop-001
mycompany/my-third-image:develop-002
mycompany/my-third-image:develop-123abc
```
