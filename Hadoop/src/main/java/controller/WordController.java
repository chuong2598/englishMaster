package controller;

import model.word.Word;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import service.WordService;

import java.util.List;

@RestController
@RequestMapping(path = "/")
public class WordController {

    @Autowired
    private WordService wordService;

    //for testing server running
    @RequestMapping(path = "words", method = RequestMethod.GET)
    public List<Word> getAllWords() {
        return wordService.getAllWords();
    }
}


