package model.hadoop;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;


import java.io.IOException;

public class Map extends Mapper<LongWritable, DBInput, IntWritable, DBMapperOutput> {

    public void map(LongWritable id, DBInput value, Context context) {
        try {
            context.write(new IntWritable(value.getDifficulty_level()),
                    new DBMapperOutput(new IntWritable(value.getId()),
                                new Text(value.getWord()),
                                new Text(value.getVietnamese()),
                                new Text(value.getSimilar_word()),
                                new Text(value.getEx1()),
                                new Text(value.getEx2()),
                                new IntWritable(value.getDifficulty_level())));
        } catch(IOException e) {
            e.printStackTrace();
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
    }
}
