FROM golang:1.12-alpine

COPY ./ /go/src/beego-server

RUN cd /go/src/beego-server \
	&& go build -o server

EXPOSE 8080

CMD ["/go/src/beego-server/server"]
