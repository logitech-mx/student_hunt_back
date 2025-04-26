const Job = require('./models/Job');
// const { faker } = require('@faker-js/faker');

const itVacancies = [
    {
        title: 'Full Stack Developer',
        company_name: 'Tech Solutions',
        salary: 1200,
        schedule: '5/2',
        working_hours: '40 hours per week',
        deadline: '2025-12-31',
        description: 'Developing and maintaining web applications using React, Node.js, and PostgreSQL.',
        requirements: 'Experience with React, Node.js, and PostgreSQL. Strong understanding of web application architecture.',
        userId: 1
    },
    {
        title: 'Backend Developer',
        company_name: 'Cloud Innovators',
        salary: 1100,
        schedule: 'Remote',
        working_hours: '40 hours per week',
        deadline: '2025-09-30',
        description: 'Building scalable backend services with Node.js and AWS.',
        requirements: 'Experience with Node.js, AWS, and microservices architecture.',
        userId: 2
    },
    {
        title: 'Frontend Developer',
        company_name: 'Web Agency',
        salary: 1000,
        schedule: '5/2',
        working_hours: '40 hours per week',
        deadline: '2025-11-15',
        description: 'Design and develop user-facing features for web applications.',
        requirements: 'Proficiency in React, HTML5, CSS3, and JavaScript.',
        userId: 3
    },
    {
        title: 'Software Engineer',
        company_name: 'NextGen Tech',
        salary: 1300,
        schedule: 'Hybrid',
        working_hours: '40 hours per week',
        deadline: '2025-10-10',
        description: 'Developing software solutions using Java and Spring Boot.',
        requirements: 'Java, Spring Boot, and experience with RESTful APIs.',
        userId: 4
    },
    {
        title: 'Data Scientist',
        company_name: 'DataX Solutions',
        salary: 1400,
        schedule: 'Remote',
        working_hours: '40 hours per week',
        deadline: '2025-07-01',
        description: 'Analyzing and visualizing large data sets using Python and SQL.',
        requirements: 'Strong knowledge of Python, machine learning algorithms, and data visualization tools.',
        userId: 5
    },
    {
        title: 'DevOps Engineer',
        company_name: 'Cloud Solutions Inc.',
        salary: 1250,
        schedule: '5/2',
        working_hours: '40 hours per week',
        deadline: '2025-08-31',
        description: 'Managing cloud infrastructure and CI/CD pipelines using AWS and Docker.',
        requirements: 'Experience with AWS, Docker, Kubernetes, and CI/CD tools.',
        userId: 1
    },
    {
        title: 'UX/UI Designer',
        company_name: 'DesignHub',
        salary: 950,
        schedule: '5/2',
        working_hours: '40 hours per week',
        deadline: '2025-12-01',
        description: 'Designing user interfaces and enhancing user experiences for web and mobile applications.',
        requirements: 'Experience with Adobe XD, Figma, and user research.',
        userId: 2
    },
    {
        title: 'Mobile Developer',
        company_name: 'App Creators',
        salary: 1100,
        schedule: 'Hybrid',
        working_hours: '40 hours per week',
        deadline: '2025-10-05',
        description: 'Building mobile applications using React Native and Swift.',
        requirements: 'Experience with React Native, Swift, and mobile app development.',
        userId: 3
    },
    {
        title: 'QA Engineer',
        company_name: 'Software Innovators',
        salary: 950,
        schedule: '5/2',
        working_hours: '40 hours per week',
        deadline: '2025-06-20',
        description: 'Writing and executing automated tests for software applications.',
        requirements: 'Experience with Selenium, Jest, and automated testing frameworks.',
        userId: 4
    },
    {
        title: 'Network Engineer',
        company_name: 'TechWave',
        salary: 1200,
        schedule: 'Hybrid',
        working_hours: '40 hours per week',
        deadline: '2025-11-01',
        description: 'Configuring and maintaining network infrastructure, ensuring security and performance.',
        requirements: 'Experience with network configuration, Cisco devices, and network security protocols.',
        userId: 5
    }
];

async function seedJobs() {
    try {
        // Удаляем все вакансии перед добавлением новых
        await Job.destroy({ where: {} });

        // Генерация вакансий из массива
        for (const job of itVacancies) {
            await Job.create(job);
        }

        console.log("10 реальных вакансий успешно добавлены в базу данных!");
    } catch (error) {
        console.error("Ошибка при добавлении вакансий:", error);
    }
}

// Запуск функции
seedJobs();
