package com.abdul_yavvan.mcp.server.controller;


import com.abdul_yavvan.mcp.server.model.UserPrompt;
import com.abdul_yavvan.mcp.server.service.McpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class McpController {

    @Autowired
    McpService service;

    @PostMapping("/sendChat")
    public UserPrompt upperCase(@RequestBody UserPrompt userPrompt){
        return service.uppercase(userPrompt);
    }

}

