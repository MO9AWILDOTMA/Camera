package ma.cinecamera.seeder;

import java.util.Arrays;

import org.springframework.stereotype.Component;

import ma.cinecamera.model.Role;
import ma.cinecamera.model.enums.ERole;
import ma.cinecamera.repository.RoleRepository;

@Component
public class RoleSeeder {
    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
	this.roleRepository = roleRepository;
    }

    public void seed() {
	Arrays.stream(ERole.values()).forEach(role -> {
	    if (!roleRepository.existsByName(role)) { // Check if the role already exists
		Role newRole = Role.builder().name(role).build();
		roleRepository.save(newRole);
	    }
	});

	System.out.println("Roles seeded successfully!");
    }
}