package com.cardbenefit.benefit.test;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/benefits")
public class TestController {
	@GetMapping("/test")
	public String test() {
		return "user";
	}

}
