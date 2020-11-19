package service;

import model.hadoop.*;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.db.DBConfiguration;
import org.apache.hadoop.mapreduce.lib.db.DBInputFormat;
import org.apache.hadoop.mapreduce.lib.db.DBOutputFormat;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.IOException;

@Transactional
@Service
public class HadoopService {

    @Autowired
    SessionFactory sessionFactory;

    public void deleteHadoopOutputData(String tableName) {
        sessionFactory.getCurrentSession().createSQLQuery("TRUNCATE TABLE " + tableName).executeUpdate();
    }

    public void triggerHadoop(int difficulty_level, String tableName) throws IOException, ClassNotFoundException, InterruptedException {

        deleteHadoopOutputData(tableName);

        Configuration conf = new Configuration();
        DBConfiguration.configureDB(conf, "com.mysql.jdbc.Driver",
                "jdbc:mysql://mydb.ct9zaewm7tpb.us-east-1.rds.amazonaws.com:3306/ebdb?useUnicode=true&characterEncoding=UTF-8", "mydb", "vippro123");

        conf.setInt("difficulty_level", difficulty_level);

        Job job = new Job(conf);
        job.setMapperClass(Map.class);
        job.setReducerClass(Reduce.class);

        job.setMapOutputKeyClass(IntWritable.class);
        job.setMapOutputValueClass(DBMapperOutput.class);

        job.setOutputKeyClass(DBReducerOutput.class);
        job.setOutputValueClass(NullWritable.class);

        job.setInputFormatClass(DBInputFormat.class);
        job.setOutputFormatClass(DBOutputFormat.class);

        DBInputFormat.setInput(job,
                DBInput.class,
                "MachineLearningWords",
                null,
                null,
                new String[] {"id", "word", "vietnamese", "similar_word", "ex1", "ex2", "difficulty_level"});


        DBOutputFormat.setOutput(
                job,
                tableName,    // output table name
                new String[] { "id", "word", "vietnamese", "similar_word", "ex1", "ex2", "difficulty_level" }   //table columns
        );


        int exit = (job.waitForCompletion(true) ? 0 : 1);

        if(exit == 0) {
            System.out.println("Job not done yet");
        } else if ( exit == 1 ) {
            System.out.println("Job done");
        }
    }
}
