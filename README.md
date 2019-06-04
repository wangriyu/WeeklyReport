### 编译部署

```bash
$ cd antd-ui
$ npm install
$ npm run start:no-mock

$ cd ../beego-server
$ go mod vendor

$ cd ../deploy
$ docker-compose up -d
```