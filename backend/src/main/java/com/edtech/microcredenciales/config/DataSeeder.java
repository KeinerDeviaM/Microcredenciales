package com.edtech.microcredenciales.config;

import com.edtech.microcredenciales.entity.AppUser;
import com.edtech.microcredenciales.entity.MicroCredential;
import com.edtech.microcredenciales.entity.Role;
import com.edtech.microcredenciales.repository.AppUserRepository;
import com.edtech.microcredenciales.repository.MicroCredentialRepository;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(
        AppUserRepository userRepository,
        MicroCredentialRepository credentialRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!userRepository.existsByEmail("admin@empresa.com")) {
                userRepository.save(new AppUser(
                    "Administrador Corporativo",
                    "admin@empresa.com",
                    passwordEncoder.encode("Admin123*"),
                    Role.ADMIN
                ));
            }

            if (!userRepository.existsByEmail("colaborador@empresa.com")) {
                userRepository.save(new AppUser(
                    "Colaborador Demo",
                    "colaborador@empresa.com",
                    passwordEncoder.encode("User123*"),
                    Role.USER
                ));
            }

            if (credentialRepository.count() == 0) {
                credentialRepository.save(sample(
                    "Fundamentos de IA para Equipos Comerciales",
                    "Ventas",
                    "Básico",
                    "Micro-credencial enfocada en uso responsable de inteligencia artificial para prospección, seguimiento y análisis de clientes corporativos.",
                    8,
                    "Academia Corporativa EdTech",
                    Set.of("IA", "Ventas consultivas", "Productividad")
                ));
                credentialRepository.save(sample(
                    "Ciberseguridad Operativa para Colaboradores",
                    "Tecnología",
                    "Intermedio",
                    "Ruta corta para fortalecer hábitos de seguridad, gestión de contraseñas, phishing y protección de información empresarial.",
                    10,
                    "Oficina de Seguridad Digital",
                    Set.of("Ciberseguridad", "Riesgo", "Buenas prácticas")
                ));
                credentialRepository.save(sample(
                    "Liderazgo Ágil en Proyectos Digitales",
                    "Talento Humano",
                    "Avanzado",
                    "Formación aplicada para líderes de squads corporativos que gestionan entregas ágiles, métricas y mejora continua.",
                    12,
                    "Universidad Corporativa",
                    Set.of("Agilidad", "Liderazgo", "OKR")
                ));
            }
        };
    }

    private MicroCredential sample(
        String title,
        String businessArea,
        String level,
        String description,
        int hours,
        String issuer,
        Set<String> tags
    ) {
        MicroCredential credential = new MicroCredential();
        credential.setTitle(title);
        credential.setBusinessArea(businessArea);
        credential.setLevel(level);
        credential.setDescription(description);
        credential.setDurationHours(hours);
        credential.setIssuer(issuer);
        credential.setSkillTags(new LinkedHashSet<>(tags));
        credential.setActive(true);
        return credential;
    }
}
