package ma.cinecamera.seeder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final RoleSeeder roleSeeder;

    @Autowired
    private AdminSeeder adminSeeder;

    public DatabaseSeeder(RoleSeeder roleSeeder) {
	this.roleSeeder = roleSeeder;
    }

    @Override
    public void run(String... args) {
	roleSeeder.seed(); // Call individual seeders
	adminSeeder.seed();
    }
}