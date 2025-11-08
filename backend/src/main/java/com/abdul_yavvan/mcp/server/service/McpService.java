package com.abdul_yavvan.mcp.server.service;

import com.abdul_yavvan.mcp.server.model.UserPrompt;
import org.springframework.stereotype.Service;

@Service
public class McpService {

    public UserPrompt uppercase(UserPrompt message) {
        String upper = message.getUserMessage().toUpperCase();
        return new UserPrompt(upper);
    }
}
