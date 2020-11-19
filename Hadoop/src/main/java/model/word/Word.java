package model.word;

import javax.persistence.*;

@Entity
@Table(name = "MachineLearningWords")
public class Word {

    @Id
    @Column
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(length = 50)
    private String word;

    @Column(length = 50)
    private String vietnamese;

    @Column(length = 50)
    private String similar_word;

    @Column(length = 250)
    private String ex1;

    @Column(length = 250)
    private String ex2;

    @Column
    private int difficulty_level;

    public Word() {
    }

    public Word(int id, String word, String vietnamese, String similar_word, String ex1, String ex2, int difficulty_level) {
        this.id = id;
        this.word = word;
        this.vietnamese = vietnamese;
        this.similar_word = similar_word;
        this.ex1 = ex1;
        this.ex2 = ex2;
        this.difficulty_level = difficulty_level;
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
        return "Word{" +
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

