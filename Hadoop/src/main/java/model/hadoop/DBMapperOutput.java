package model.hadoop;

import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.io.WritableComparable;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;

public class DBMapperOutput implements WritableComparable<DBMapperOutput> {

    private IntWritable id;
    private Text word, vietnamese, similar_word, ex1, ex2;
    private IntWritable difficulty_level;


    public DBMapperOutput() {
        this.id = new IntWritable();
        this.word = new Text();
        this.vietnamese = new Text();
        this.similar_word = new Text();
        this.ex1 = new Text();
        this.ex2 = new Text();
        this.difficulty_level = new IntWritable();
    }

    public DBMapperOutput(IntWritable id, Text word, Text vietnamese, Text similar_word, Text ex1, Text ex2, IntWritable difficulty_level) {
        this.id = id;
        this.word = word;
        this.vietnamese = vietnamese;
        this.similar_word = similar_word;
        this.ex1 = ex1;
        this.ex2 = ex2;
        this.difficulty_level = difficulty_level;
    }

    public void set(IntWritable id, Text word, Text vietnamese, Text similar_word, Text ex1, Text ex2, IntWritable difficulty_level)
    {
        this.id = id;
        this.word = word;
        this.vietnamese = vietnamese;
        this.similar_word = similar_word;
        this.ex1 = ex1;
        this.ex2 = ex2;
        this.difficulty_level = difficulty_level;
    }

    @Override
    public void write(DataOutput dataOutput) throws IOException {
        id.write(dataOutput);
        word.write(dataOutput);
        vietnamese.write(dataOutput);
        similar_word.write(dataOutput);
        ex1.write(dataOutput);
        ex2.write(dataOutput);
        difficulty_level.write(dataOutput);
    }

    @Override
    public void readFields(DataInput dataInput) throws IOException {
        id.readFields(dataInput);
        word.readFields(dataInput);
        vietnamese.readFields(dataInput);
        similar_word.readFields(dataInput);
        ex1.readFields(dataInput);
        ex2.readFields(dataInput);
        difficulty_level.readFields(dataInput);
    }


    public IntWritable getId() {
        return id;
    }

    public Text getWord() {
        return word;
    }

    public Text getVietnamese() {
        return vietnamese;
    }

    public Text getSimilar_word() {
        return similar_word;
    }

    public Text getEx1() {
        return ex1;
    }

    public Text getEx2() {
        return ex2;
    }

    public IntWritable getDifficulty_level() {
        return difficulty_level;
    }

    public void setId(IntWritable id) {
        this.id = id;
    }

    public void setWord(Text word) {
        this.word = word;
    }

    public void setVietnamese(Text vietnamese) {
        this.vietnamese = vietnamese;
    }

    public void setSimilar_word(Text similar_word) {
        this.similar_word = similar_word;
    }

    public void setEx1(Text ex1) {
        this.ex1 = ex1;
    }

    public void setEx2(Text ex2) {
        this.ex2 = ex2;
    }

    public void setDifficulty_level(IntWritable difficulty_level) {
        this.difficulty_level = difficulty_level;
    }


    @Override
    public String toString() {
        return "DBMapperOutput{" +
                "id=" + id +
                ", word='" + word + '\'' +
                ", vietnamese='" + vietnamese + '\'' +
                ", similar_word='" + similar_word + '\'' +
                ", ex1='" + ex1 + '\'' +
                ", ex2='" + ex2 + '\'' +
                ", difficulty_level=" + difficulty_level +
                '}';
    }

    @Override
    public int compareTo(DBMapperOutput o) {
        return 0;
    }

}
