# NPM Registry

## Dependencies

- [Docker](https://docs.docker.com/get-docker/)
- [nrm](https://www.npmjs.com/package/nrm)

## Start NPM registry server

```bash
docker-compose up -d
```

## Use local NPM registry server

```bash
nrm add local http://localhost:4873

nrm use local
```

## Show All registry

```bash
nrm ls
```
