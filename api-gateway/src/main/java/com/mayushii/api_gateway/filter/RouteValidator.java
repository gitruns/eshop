package com.mayushii.api_gateway.filter;

import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

        public static final List<String> openApiEndpoints = List.of(
                        "/auth/register",
                        "/auth/login",
                        "/eureka");

        // true = secured (auth required), false = open
        public Predicate<ServerHttpRequest> isSecured = request -> {
                String path = request.getURI().getPath();

                boolean isOpenPath = openApiEndpoints.stream()
                                .anyMatch(path::contains);

                boolean isGet = HttpMethod.GET.equals(request.getMethod());

                // secured only if NOT an open path AND NOT a GET
                return !(isOpenPath || isGet);
        };
}