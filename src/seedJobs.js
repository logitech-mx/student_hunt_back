const Job = require('./models/Job'); // Путь до модели Job, если она в другом месте, исправь
const { faker } = require('@faker-js/faker'); // Для генерации случайных данных

async function seedJobs() {
    try {
        // Удаляем все вакансии перед добавлением новых
        await Job.destroy({ where: {} });

        // Генерируем 15 вакансий
        for (let i = 0; i < 15; i++) {
            await Job.create({
                title: faker.person.jobTitle(), // Генерация случайного названия вакансии
                company_name: faker.company.name(), // Генерация названия компании
                salary: faker.number.int({ min: 500, max: 1000 }), // Генерация случайной зарплаты
                schedule: "5/2", // Стандартный график
                working_hours: "40 часов в неделю", // Стандартное количество рабочих часов
                deadline: faker.date.future().toISOString().split('T')[0], // Генерация будущего дедлайна
                description: faker.lorem.paragraph(), // Генерация случайного описания
                requirements: faker.lorem.sentence(), // Генерация случайных требований
                userId: faker.number.int({ min: 1, max: 5 })
            });
        }

        console.log("15 вакансий успешно добавлены в базу данных!");
    } catch (error) {
        console.error("Ошибка при добавлении вакансий:", error);
    }
}

// Запуск функции
seedJobs();
