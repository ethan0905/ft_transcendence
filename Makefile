# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: esafar <esafar@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/13 12:28:32 by c2h6              #+#    #+#              #
#    Updated: 2023/03/03 16:46:13 by esafar           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:	install up 

up:
	docker-compose up --build

install:
	(cd ./backend ; npm install)
	(cd ./frontend ; npm install)

gotoc:
	docker exec -it backend_nestjs bash

prisma:
	docker exec backend_nestjs npx prisma studio

update:
	docker build -t backend_nestjs ./backend
	
info:
	@docker ps
	@echo "\n"
	@docker images
	@echo "\n"
	@docker volume ls
	@echo "\n"

down:
	docker-compose -f docker-compose.yml down

fclean: down
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
	docker system prune -a --force

clean_modules:
	rm -rf ./backend/node_modules
	rm -rf ./frontend/node_modules

re:
	fclean
	all

.PHONY:	all up install schema prisma info down fclean clean_modules re