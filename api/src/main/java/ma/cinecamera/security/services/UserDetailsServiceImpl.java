package ma.cinecamera.security.services;

import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ma.cinecamera.model.User;
import ma.cinecamera.repository.UserRepository;

@Component
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
	User user = repository.findByEmail(email)
		.orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
	return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
		user.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName().toString()))
			.collect(Collectors.toList()));
    }

}
