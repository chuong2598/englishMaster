package model.hadoop;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.mapreduce.Reducer;
import java.io.IOException;

public class Reduce extends Reducer<IntWritable, DBMapperOutput, DBReducerOutput, NullWritable> {


    protected void reduce(IntWritable key, Iterable<DBMapperOutput> values, Context ctx) {
        Configuration conf = ctx.getConfiguration();
        int difficulty_level = conf.getInt("difficulty_level", 0);


        for(DBMapperOutput value : values)
        {
            if (difficulty_level == value.getDifficulty_level().get()) {
                try {
                    ctx.write(new DBReducerOutput(value.getId().get(), value.getWord().toString(),
                        value.getVietnamese().toString(), value.getSimilar_word().toString(),
                        value.getEx1().toString(), value.getEx2().toString(),
                        value.getDifficulty_level().get()), NullWritable.get());
                } catch(IOException e) {
                    e.printStackTrace();
                } catch(InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
