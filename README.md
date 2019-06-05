### 编译部署

```bash
$ cd antd-ui
$ npm install
// dev npm run start:no-mock
$ npm run build

$ cd ../beego-server
$ go mod vendor

$ cd ../deploy
$ docker-compose up -d
```

web: localhost:8081

account: admin/123456789
