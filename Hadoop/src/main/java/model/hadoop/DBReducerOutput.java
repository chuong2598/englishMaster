package model.hadoop;

import org.apache.hadoop.io.Writable;
import org.apache.hadoop.mapreduce.lib.db.DBWritable;

import javax.persistence.*;
import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


public class DBReducerOutput implements Writable, DBWritable {

    private int id;

    private String word;


    private String vietnamese;

    private String similar_word;

    private String ex1;

    private String ex2;

    @Column
    private int difficulty_level;


    public DBReducerOutput() {
    }

    public DBReducerOutput(int id, String word, String vietnamese, String similar_word, String ex1, String ex2, int difficulty_level) {
        this.id = id;
        this.word = word;
        this.vietnamese = vietnamese;
        this.similar_word = similar_word;
        this.ex1 = ex1;
        this.ex2 = ex2;
        this.difficulty_level = difficulty_level;
    }


    @Override
    public void write(PreparedStatement preparedStatement) throws SQLException {
        preparedStatement.setInt(1, id);
        preparedStatement.setString(2, word);
        preparedStatement.setString(3, vietnamese);
        preparedStatement.setString(4, similar_word);
        preparedStatement.setString(5, ex1);
        preparedStatement.setString(6, ex2);
        preparedStatement.setInt(7, difficulty_level);
    }

    @Override
    public void readFields(ResultSet resultSet) throws SQLException {
        id = resultSet.getInt(1);
        word = resultSet.getString(2);
        vietnamese = resultSet.getString(3);
        similar_word = resultSet.getString(4);
        ex1 = resultSet.getString(5);
        ex2 = resultSet.getString(6);
        difficulty_level = resultSet.getInt(7);
    }

    @Override
    public void write(DataOutput dataOutput) throws IOException {

    }

    @Override
    public void readFields(DataInput dataInput) throws IOException {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getVietnamese() {
        return vietnamese;
    }

    public void setVietnamese(String vietnamese) {
        this.vietnamese = vietnamese;
    }

    public String getSimilar_word() {
        return similar_word;
    }

    public void setSimilar_word(String similar_word) {
        this.similar_word = similar_word;
    }

    public String getEx1() {
        return ex1;
    }

    public void setEx1(String ex1) {
        this.ex1 = ex1;
    }

    public String getEx2() {
        return ex2;
    }

    public void setEx2(String ex2) {
        this.ex2 = ex2;
    }

    public int getDifficulty_level() {
        return difficulty_level;
    }

    public void setDifficulty_level(int difficulty_level) {
        this.difficulty_level = difficulty_level;
    }

    @Override
    public String toString() {
        return "DBReducerOutput{" +
                "id=" + id +
                ", word='" + word + '\'' +
                ", vietnamese='" + vietnamese + '\'' +
                ", similar_word='" + similar_word + '\'' +
                ", ex1='" + ex1 + '\'' +
                ", ex2='" + ex2 + '\'' +
                ", difficulty_level=" + difficulty_level +
                '}';
    }
}
