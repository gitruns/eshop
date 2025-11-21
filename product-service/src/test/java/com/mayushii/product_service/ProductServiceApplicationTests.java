package com.mayushii.product_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
		"spring.datasource.driver-class-name=org.h2.Driver",
		"spring.datasource.username=sa",
		"spring.datasource.password=",
		"spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
		"spring.jpa.hibernate.ddl-auto=create-drop",
		"jwt.secret=dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLWhzMjU2",
		"app.jwt-secret=dGVzdC1zZWNyZXQta2V5LXRoYXQtaXMtc3VmZmljaWVudGx5LWxvbmctZm9yLWhzMjU2",
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false",
		"eureka.client.register-with-eureka=false"
})
class ProductServiceApplicationTests {

	@Test
	void contextLoads() {
	}

}
