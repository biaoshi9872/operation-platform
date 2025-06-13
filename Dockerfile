# VERSION 1  
# Author: mcdull
 
# 定义基础包
#FROM nginx:1.17.2
FROM registry-vpc.cn-hangzhou.aliyuncs.com/nfc/ycb_nginx:1.17.2


# 设置时区
# 修改nginx启动用户为root
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone;\
     sed -i "s/user  nginx/user  root/" /etc/nginx/nginx.conf

# 拷贝程序
#ADD dist /usr/share/nginx/html/dist
ADD dist /usr/share/nginx/html/api_platform
