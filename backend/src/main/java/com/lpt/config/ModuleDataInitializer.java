package com.lpt.config;

import com.lpt.entity.CourseEntity;
import com.lpt.entity.LearningModuleEntity;
import com.lpt.repository.CourseRepository;
import com.lpt.repository.LearningModuleRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class ModuleDataInitializer implements CommandLineRunner {
    private final CourseRepository courseRepository;
    private final LearningModuleRepository moduleRepository;

    public ModuleDataInitializer(CourseRepository courseRepository, LearningModuleRepository moduleRepository) {
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
    }

    @Override
    public void run(String... args) {
        for (CourseEntity course : courseRepository.findAll()) {
            if (moduleRepository.countByCourseId(course.getCourseId()) == 0) {
                seed(course);
            }
        }
    }

    private void seed(CourseEntity course) {
        List<String[]> modules = modulesFor(course.getCourseName());
        LocalDate start = LocalDate.now().plusDays(5);
        for (int i = 0; i < modules.size(); i++) {
            LearningModuleEntity module = new LearningModuleEntity();
            module.setCourseId(course.getCourseId());
            module.setTitle("Module " + (i + 1) + ": " + modules.get(i)[0]);
            module.setDescription(modules.get(i)[1]);
            module.setDueDate(start.plusDays((long) i * 5));
            module.setResources("Course notes, practice tasks, and reference links");
            module.setAssignmentTitle(modules.get(i)[0] + " PDF Assignment");
            module.setAssignmentDescription("Prepare a short PDF explaining what you learned, examples, and key outputs.");
            module.setSubmissionRequired(true);
            moduleRepository.save(module);
        }
    }

    private List<String[]> modulesFor(String rawName) {
        String name = rawName == null ? "" : rawName.toLowerCase();
        if (name.contains("python") || name.contains("cfai")) return fixed(name.contains("cfai") ? cfai() : python());
        if (name.contains("machine")) return ml();
        if (name.contains("react") || name.contains("frontend")) return fixed(react());
        if (name.contains("spring") || name.contains("java")) return spring();
        if (name.contains("aws") || name.contains("cloud")) return aws();
        if (name.contains("dsa")) return fixed(dsa());
        return generic(Math.max(1, rawName == null ? 10 : 10), rawName == null ? "Course" : rawName);
    }

    private List<String[]> fixed(String[][] rows) {
        return new ArrayList<>(List.of(rows));
    }

    private List<String[]> generic(int count, String name) {
        List<String[]> rows = new ArrayList<>();
        for (int i = 1; i <= count; i++) rows.add(new String[] {"Topic " + i, "Learn " + name + " topic " + i + " with practical submission."});
        return rows;
    }

    private String[][] python() { return new String[][] {
        {"Introduction to Python","Learn what Python is, its applications, installation, and your first program."},
        {"Variables and Data Types","Understand variables, integers, floats, strings, booleans, and type conversion."},
        {"Operators","Learn arithmetic, relational, logical, assignment, and bitwise operators."},
        {"Input and Output","Take user input and display formatted output."},
        {"Conditional Statements","Implement decision-making using if, else, and elif."},
        {"Loops","Master for loops and while loops with practical examples."},
        {"Strings","Perform string manipulation and explore built-in string methods."},
        {"Lists","Create, update, and process lists effectively."},
        {"Tuples and Sets","Learn immutable collections and unique-value storage."},
        {"Dictionaries","Store and access data using key-value pairs."},
        {"Functions","Create reusable blocks of code with parameters and return values."},
        {"Recursion","Solve problems using recursive function calls."},
        {"File Handling","Read from and write to files."},
        {"Exception Handling","Handle runtime errors using try-except blocks."},
        {"Modules and Packages","Organize and reuse Python code efficiently."},
        {"OOP Basics","Learn classes, objects, constructors, and methods."},
        {"Inheritance","Extend existing classes through inheritance."},
        {"Polymorphism and Encapsulation","Explore advanced OOP concepts."},
        {"Mini Project","Build a console-based application using Python concepts."},
        {"Final Assessment","Complete coding challenges and project submission."}
    }; }

    private List<String[]> ml() {
        List<String[]> rows = fixed(new String[][] {
            {"Introduction to Machine Learning","Understand ML concepts, applications, and workflow."},
            {"Types of ML","Supervised, unsupervised, and reinforcement learning."},
            {"Python for ML","Use NumPy, Pandas, and Matplotlib."},
            {"Data Collection","Gather datasets from various sources."},
            {"Data Cleaning","Handle missing and inconsistent data."},
            {"Data Visualization","Create charts and graphs for analysis."},
            {"Feature Engineering","Transform raw data into meaningful features."},
            {"Train-Test Split","Prepare data for model training."},
            {"Linear Regression","Predict continuous values."},
            {"Multiple Linear Regression","Use multiple features for prediction."},
            {"Logistic Regression","Perform classification tasks."},
            {"Decision Trees","Build tree-based prediction models."},
            {"Random Forest","Improve accuracy using ensemble methods."},
            {"KNN","Learn nearest-neighbor classification."},
            {"Naive Bayes","Probabilistic classification techniques."},
            {"SVM","Create high-performance classifiers."},
            {"Clustering","Group similar data points."},
            {"K-Means","Implement clustering algorithms."},
            {"PCA","Reduce dataset dimensions."},
            {"Model Evaluation","Measure model performance."}
        });
        for (int i = 21; i <= 35; i++) rows.add(new String[] {"Advanced ML Concept " + i, "Advanced ML concepts, tuning, pipelines, deployment, and case studies."});
        rows.addAll(fixed(new String[][] {
            {"Recommendation Systems","Build content and collaborative filtering systems."},
            {"NLP Basics","Process and analyze text data."},
            {"Deep Learning Introduction","Explore neural networks."},
            {"ML Project","End-to-end project implementation."},
            {"Final Assessment","Project submission and evaluation."}
        }));
        return rows;
    }

    private String[][] react() { return new String[][] {
        {"Introduction to React","Learn React fundamentals and project setup."},{"JSX","Write HTML-like syntax inside JavaScript."},
        {"Components","Create reusable UI components."},{"Props","Pass data between components."},{"State","Manage dynamic data."},
        {"Event Handling","Handle user interactions."},{"Conditional Rendering","Display content dynamically."},{"Lists and Keys","Render collections efficiently."},
        {"Forms","Build interactive forms."},{"Hooks Overview","Introduction to React Hooks."},{"useState","Manage component state."},
        {"useEffect","Handle side effects."},{"useContext","Share global state."},{"Routing","Navigate between pages."},
        {"API Integration","Fetch data from backend services."},{"Authentication","Implement login systems."},{"Performance Optimization","Improve application efficiency."},
        {"Deployment","Deploy React applications."},{"React Project","Build a complete frontend project."},{"Final Assessment","Project review and submission."}
    }; }

    private List<String[]> spring() {
        List<String[]> rows = fixed(new String[][] {
            {"Spring Boot Introduction","Learn Spring Boot fundamentals."},{"Project Setup","Configure Maven and dependencies."},{"REST APIs","Create RESTful web services."},
            {"Controllers","Handle HTTP requests."},{"Services","Implement business logic."},{"Repositories","Connect with databases."},{"MySQL Integration","Store and retrieve data."},
            {"JPA & Hibernate","ORM concepts and implementation."},{"CRUD Operations","Build create, read, update, delete APIs."},{"Validation","Validate incoming data."}
        });
        for (int i = 11; i <= 25; i++) rows.add(new String[] {"Backend Engineering Topic " + i, "Security, JWT, exception handling, testing, microservices, Docker, Swagger, caching, and deployment."});
        rows.addAll(fixed(new String[][] {{"Spring Security","Secure applications."},{"JWT Authentication","Implement token-based security."},{"Docker Deployment","Containerize applications."},{"Capstone Project","Build a production-ready backend."},{"Final Assessment","Project submission and review."}}));
        return rows;
    }

    private List<String[]> aws() {
        List<String[]> rows = fixed(new String[][] {
            {"Cloud Computing Fundamentals","Understand cloud concepts and benefits."},{"AWS Overview","Explore AWS services ecosystem."},{"IAM","Manage users and permissions."},{"EC2","Launch and manage virtual servers."},{"S3","Store and retrieve files."},{"VPC","Configure private cloud networks."},{"RDS","Manage relational databases."},{"Lambda","Build serverless applications."},{"CloudWatch","Monitor AWS resources."},{"Auto Scaling","Automatically scale infrastructure."}
        });
        for (int i = 11; i <= 20; i++) rows.add(new String[] {"AWS Operations Topic " + i, "Route53, load balancer, EKS, ECS, security, cost optimization, backup and recovery."});
        rows.addAll(fixed(new String[][] {{"CI/CD with AWS","Automate deployment pipelines."},{"Infrastructure as Code","Use CloudFormation."},{"AWS Project Planning","Design cloud architecture."},{"AWS Capstone Project","Deploy a complete application."},{"Final Assessment","Architecture review and submission."}}));
        return rows;
    }

    private String[][] cfai() { return new String[][] {
        {"Introduction to Artificial Intelligence","Understand AI concepts and applications."},{"Intelligent Agents","Learn PEAS and environment models."},{"Problem Solving","State-space search techniques."},{"BFS and DFS","Implement uninformed search."},{"Heuristic Search","Learn A* and Greedy Search."},{"Knowledge Representation","Represent information in AI systems."},{"Logic in AI","Propositional and predicate logic."},{"Expert Systems","Rule-based reasoning."},{"Machine Learning Basics","Learn fundamental ML concepts."},{"Neural Networks","Introduction to deep learning."},{"NLP","Process human language."},{"Computer Vision","Analyze images and videos."},{"Reinforcement Learning","Learn through rewards and penalties."},{"Ethics in AI","Responsible AI practices."},{"AI Frameworks","TensorFlow and PyTorch basics."},{"AI Deployment","Deploy AI applications."},{"AI Case Studies","Real-world implementations."},{"Mini AI Project","Build an AI-based solution."},{"Project Documentation","Prepare technical reports."},{"Final Assessment","Project submission and evaluation."}
    }; }

    private String[][] dsa() { return new String[][] {
        {"Introduction to DSA","Learn the importance of data structures and algorithms."},{"Arrays","Perform operations on arrays."},{"Linked Lists","Implement singly and doubly linked lists."},{"Stacks","Solve problems using LIFO structures."},{"Queues","Implement FIFO operations."},{"Trees","Work with binary trees and BSTs."},{"Graphs","Explore graph representations and traversals."},{"Sorting Algorithms","Learn Bubble, Merge, Quick, and Heap Sort."},{"Searching Algorithms","Implement Linear and Binary Search."},{"Capstone DSA Project","Solve real-world coding problems and submit solutions."}
    }; }
}
