package service;

import model.word.Word;
import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
@Service
public class WordService {

    @Autowired
    SessionFactory sessionFactory;

    public List<Word> getAllWords() {
        Query query = sessionFactory.getCurrentSession().createQuery("from Word");
        return query.list();
    }
}
