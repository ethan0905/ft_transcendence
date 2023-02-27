# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: esafar <esafar@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/13 12:28:32 by c2h6              #+#    #+#              #
#    Updated: 2023/02/27 15:52:41 by esafar           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:	install up 

up:
	docker-compose up --build

install:
	(cd ./backend ; npm install)
	(cd ./frontend ; npm install)
	
schema:
	docker exec backend_nestjs npx prisma migrate dev

prisma:
	docker exec backend_nestjs npx prisma studio

	
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