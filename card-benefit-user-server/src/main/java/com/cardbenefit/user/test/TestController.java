package com.cardbenefit.user.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
//테스트용 컨트롤러
@RestController
@RequestMapping("/api/users")
public class TestController {
	@GetMapping("/test")
	public String test() {
		return "user";
	}

}
