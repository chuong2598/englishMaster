package controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import service.HadoopService;

import java.io.IOException;

@RestController
@RequestMapping(path = "/")
public class HadoopController {

    @Autowired
    private HadoopService hadoopService;

    @RequestMapping(path= "wordsort", method= RequestMethod.GET)
    @Scheduled(cron="0 0 0 ? * 7")
    public void wordDifficultySort() throws IOException, ClassNotFoundException, InterruptedException {
        String[] tableNames = new String[]{"EasyWords", "NormalWords", "DifficultWords"};
        for (int i = 1; i < 4; i++) {
            hadoopService.triggerHadoop(i, tableNames[i-1]);
        }
    }
}
