# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: c2h6 <esafar@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2022/09/13 12:28:32 by c2h6              #+#    #+#              #
#    Updated: 2022/09/13 12:28:34 by c2h6             ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

all:	up

# to build the config for frontend
up:
	docker-compose up --build

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