use mysql;
select host, user from user;
-- 因为mysql版本是5.7，因此新建用户为如下命令：
create user weekly identified by '13579';
-- 将docker_mysql数据库的权限授权给创建的docker用户，密码为123456：
grant all on weekly_db.* to weekly@'%' identified by '13579' with grant option;
-- 这一条命令一定要有：
flush privileges;
