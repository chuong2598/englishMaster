package config;

import controller.HadoopController;
import org.hibernate.SessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.hibernate4.HibernateTransactionManager;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Properties;

@Configuration
@EnableTransactionManagement
@EnableWebMvc
@ComponentScan({"controller", "service", "config"})
@EnableScheduling
public class AppConfig {

    @Bean
    public HadoopController hadoopController() {
        return new HadoopController();
    }

    @Bean
    public LocalSessionFactoryBean sessionFactory() {

        Properties properties = new Properties();
        //For MySQL
        properties.put("hibernate.dialect", "org.hibernate.dialect.MySQLDialect");
        properties.put("hibernate.show_sql", true);
        properties.put("hibernate.hbm2ddl.auto", "update");

        LocalSessionFactoryBean sessionFactoryBean = new LocalSessionFactoryBean();

        sessionFactoryBean.setPackagesToScan("java");

        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://mydb.ct9zaewm7tpb.us-east-1.rds.amazonaws.com:3306/ebdb?useUnicode=true&characterEncoding=UTF-8");
        dataSource.setUsername("mydb");
        dataSource.setPassword("vippro123");

        sessionFactoryBean.setDataSource(dataSource);
        sessionFactoryBean.setHibernateProperties(properties);
        sessionFactoryBean.setPackagesToScan("model");

        return sessionFactoryBean;
    }

    @Bean
    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory) {
        HibernateTransactionManager tx = new HibernateTransactionManager(sessionFactory);
        return tx;
    }
}
