package ma.cinecamera.seeder;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import ma.cinecamera.model.Role;
import ma.cinecamera.model.User;
import ma.cinecamera.repository.RoleRepository;
import ma.cinecamera.repository.UserRepository;

@Component
public class AdminSeeder {

    @Autowired
    private UserRepository repository;
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Transactional
    public void seed() {
	if (repository.count() == 0) {
	    // Fetch all roles
	    List<Role> roles = roleRepository.findAll();
	    System.out.println("Fetched roles: " + roles);

	    // Ensure roles are managed (attached to the persistence context)
	    roles = roleRepository.saveAll(roles);
	    System.out.println("Managed roles: " + roles);

	    String encodedPass = encoder.encode("password");

	    // Build the admin user
	    User admin = User.builder().firstName("Anass").lastName("Benfill").email("anass@gmail.com")
		    .password(encodedPass).phone("212682673919").enable(true).roles(roles) // Associate managed roles
		    .build();

	    // Save the admin user
	    repository.save(admin);
	    System.out.println("Admin seeded successfully!");
	}
    }
}
