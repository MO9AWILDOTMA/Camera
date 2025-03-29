package ma.cinecamera.security.jwt;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import ma.cinecamera.security.services.UserDetailsServiceImpl;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.header.string}")
    public String HEADER_STRING;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private TokenProvider jwtTokenUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
	    throws IOException, ServletException {
	String header = req.getHeader(HEADER_STRING);
	String username = null;
	String authToken = null;
	logger.warn("header :" + header);

	if (header != null) {
	    String[] cookies = header.split("; ");
	    for (String cookie : cookies) {
		if (cookie.startsWith("Authorization=")) {
		    authToken = cookie.substring(14); // Extract the token
		    break;
		}
	    }
	}

	if (authToken != null) {
	    try {
		username = jwtTokenUtil.extractUsername(authToken);
		// Proceed with authentication
	    } catch (ExpiredJwtException e) {
		logger.warn("Token expired", e);
	    } catch (Exception e) {
		logger.error("Authentication failed", e);
	    }
	} else {
	    logger.warn("No Authorization token found");
	}

	if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
	    UserDetails userDetails = userDetailsService.loadUserByUsername(username);

	    if (jwtTokenUtil.validateToken(authToken, userDetails)) {
		UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
			userDetails, null, userDetails.getAuthorities());
		authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
		logger.info("User authenticated: " + username + ", setting security context");
		SecurityContextHolder.getContext().setAuthentication(authentication);
	    }
	}

	chain.doFilter(req, res);
    }

}