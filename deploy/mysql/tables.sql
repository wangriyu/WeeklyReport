CREATE database IF NOT EXISTS  `weekly_db` default character set utf8mb4;
USE `weekly_db`;

CREATE TABLE IF NOT EXISTS `staff` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `nickname` varchar(64) UNIQUE NOT NULL COMMENT '唯一账户名',
    `name` varchar(64) NOT NULL COMMENT '真实姓名',
    `password` varchar(128) NOT NULL COMMENT '密码，哈希',
    `join_date` date NOT NULL COMMENT '入职日期',
    `department` varchar(20) NOT NULL DEFAULT 'default' COMMENT '部门',
    `mail` varchar(64) NOT NULL COMMENT '邮箱',
    `mobile` varchar(12) NOT NULL COMMENT '手机号',
    `role` char(10) NOT NULL COMMENT '权限角色',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    INDEX group_by_department (department(20))
) ENGINE=InnoDB  AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO staff (nickname, name, password, join_date, department, mail, mobile, role, status) VALUES ('admin', 'administrator', '3RUHCY7CLiglceD142/dVoLSux8O5yX+AgcYs60pXfk=', '2019-05-21', 'default', 'wangriyu1997@gmail.com', '18888888888', 'admin', 5);

CREATE TABLE IF NOT EXISTS `marketing_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `hygiene` tinyint DEFAULT 0 COMMENT '卫生',
    `meeting` tinyint DEFAULT 0 COMMENT '晨会',
    `work` tinyint DEFAULT 0 COMMENT '工作',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `aftersale_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `work_item5` tinyint DEFAULT 0 COMMENT '工作项5',
    `work_item6` tinyint DEFAULT 0 COMMENT '工作项6',
    `work_item7` tinyint DEFAULT 0 COMMENT '工作项7',
    `work_item8` tinyint DEFAULT 0 COMMENT '工作项8',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `techsupport_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `work_item5` tinyint DEFAULT 0 COMMENT '工作项5',
    `work_item6` tinyint DEFAULT 0 COMMENT '工作项6',
    `work_item7` tinyint DEFAULT 0 COMMENT '工作项7',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `develop_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `work_item5` tinyint DEFAULT 0 COMMENT '工作项5',
    `work_item6` tinyint DEFAULT 0 COMMENT '工作项6',
    `work_item7` tinyint DEFAULT 0 COMMENT '工作项7',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `finance_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `work_item5` tinyint DEFAULT 0 COMMENT '工作项5',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `office_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `work_item5` tinyint DEFAULT 0 COMMENT '工作项5',
    `work_item6` tinyint DEFAULT 0 COMMENT '工作项6',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `product_daily` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `date` date NOT NULL COMMENT '日期',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `work_item1` tinyint DEFAULT 0 COMMENT '工作项1',
    `work_item2` tinyint DEFAULT 0 COMMENT '工作项2',
    `work_item3` tinyint DEFAULT 0 COMMENT '工作项3',
    `work_item4` tinyint DEFAULT 0 COMMENT '工作项4',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE daily_work (executor, date),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `weekly` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `title` varchar(12) NOT NULL COMMENT '周索引，比如 2019-21周',
    `executor` int(16) unsigned NOT NULL COMMENT '执行者',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `description` varchar(512) COMMENT '周计划任务内容',
    `goal` varchar(512) COMMENT '周计划工作目标',
    `remark` varchar(512) COMMENT '备注',
    `department` varchar(20) NOT NULL DEFAULT 'default' COMMENT '部门',
    `complete` varchar(512) COMMENT '已完成任务',
    `summary` varchar(512) COMMENT '周总结目标完成综述',
    `stage` varchar(512) COMMENT '周总结任务目标完成阶段',
    `result` varchar(512) COMMENT '部门经理审核',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    UNIQUE weekly_work(executor, title),
    FOREIGN KEY(`executor`) references staff(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `weekly_plan` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `pid` int(16) unsigned NOT NULL COMMENT '周计划 ID',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `description` varchar(512) COMMENT '工作计划描述',
    `goal` varchar(256) COMMENT '完成目标',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`pid`) references weekly(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `weekly_summary` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `pid` int(16) unsigned NOT NULL COMMENT '周计划 ID',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `description` varchar(512) COMMENT '工作内容描述',
    `result` varchar(256) COMMENT '结果',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`pid`) references weekly(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `annually` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `title` varchar(8) NOT NULL UNIQUE COMMENT '年索引，比如 2019',
    `goal` varchar(512) COMMENT '总体目标',
    `plan` varchar(512) COMMENT '工作计划',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `annually_item` (
    `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
    `pid` int(16) unsigned NOT NULL COMMENT '年计划 ID',
    `status` tinyint DEFAULT 0 COMMENT '状态',
    `title` varchar(64) NOT NULL COMMENT '项目名称',
    `description` varchar(512) COMMENT '描述',
    `priority` tinyint DEFAULT 0 COMMENT '优先级',
    `deadline` datetime COMMENT '完成截止时间',
    `leader` varchar(64) NOT NULL COMMENT '负责人',
    `progress` varchar(128) COMMENT '项目进度',
    `result` varchar(128) COMMENT '验收结果',
    `created` datetime NOT NULL DEFAULT current_timestamp,
    `updated` timestamp DEFAULT current_timestamp on update current_timestamp,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`pid`) references annually(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
