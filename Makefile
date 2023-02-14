# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: esafar <esafar@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/13 12:28:32 by c2h6              #+#    #+#              #
#    Updated: 2023/02/14 19:35:22 by esafar           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:	up

up:
	docker-compose up --build

schema:
	docker cp backend/prisma/schema.prisma backend_prisma:/schema.prisma
	docker exec backend_prisma npx prisma migrate dev

upd:
	docker-compose -f docker-compose.yml up -d

info:
	@docker ps
	@echo "\n"
	@docker images
	@echo "\n"
	@docker volume ls
	@echo "\n"
	@docker network ls

down:
	docker-compose -f docker-compose.yml down

ps:
	docker-compose -f docker-compose.yml ps

fclean: down
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
	docker system prune -a --force

re:
	docker-compose -f docker-compose.yml build
	docker-compose -f docker-compose.yml up

.PHONY:	all up down ps fclean re