import React, { useState, useEffect } from "react";
import "./AquariumApp.css"; // Импортируем отдельный CSS файл

// Основной компонент приложения
function AquariumCodeApp() {
    const [code, setCode] = useState("");
    const [aquarium, setAquarium] = useState({
        type: "стандартный",
        plants: ["водоросли"],
        fish: ["гуппи"],
        temperature: 24,
        ph: 7.0,
        size: "средний",
    });
    const [task, setTask] = useState({});
    const [output, setOutput] = useState("");
    const [level, setLevel] = useState(1);

    // Загрузка задания в зависимости от уровня
    useEffect(() => {
        loadTask(level);
    }, [level]);

    // Функция загрузки задания
    const loadTask = (level) => {
        const tasks = [
            {
                id: 1,
                title: "Создаем среду для сома",
                description:
                    "Сом требует особых условий. Напиши код, который настроит правильный аквариум для сома.",
                hint: "Помни, что сомы любят низкую освещенность, pH около 6.5-7.5 и температуру 22-26°C.",
                initialCode:
                    "# Используй эти функции:\n# set_aquarium_type(тип) - установить тип аквариума\n# add_plant(растение) - добавить растение\n# remove_plant(растение) - удалить растение\n# add_fish(рыба) - добавить рыбу\n# set_temperature(градусы) - установить температуру\n# set_ph(уровень) - установить pH\n\n# Твой код:\n",
                validation: (aq) => {
                    return (
                        aq.type.includes("тёмный") &&
                        aq.temperature >= 22 &&
                        aq.temperature <= 26 &&
                        aq.ph >= 6.5 &&
                        aq.ph <= 7.5 &&
                        aq.plants.some(
                            (p) => p.includes("коряга") || p.includes("укрытие")
                        )
                    );
                },
            },
            {
                id: 2,
                title: "Подбираем соседей для сома",
                description:
                    "Добавь в аквариум рыб, которые могут мирно сосуществовать с сомом.",
                hint: "Сомы хорошо уживаются с гурами, данио и спокойными цихлидами.",
                initialCode:
                    "# Сом уже добавлен в аквариум\n# Используй функции:\n# add_fish(рыба) - добавить рыбу\n# check_compatibility(рыба1, рыба2) - проверить совместимость\n\n# Твой код:\n",
                validation: (aq) => {
                    return (
                        aq.fish.includes("сом") &&
                        aq.fish.some((f) =>
                            ["гурами", "данио", "цихлида"].includes(f)
                        ) &&
                        !aq.fish.includes("золотая рыбка")
                    );
                },
            },
        ];

        setTask(tasks.find((t) => t.id === level) || tasks[0]);
        setCode(
            tasks.find((t) => t.id === level)?.initialCode ||
                tasks[0].initialCode
        );
    };

    // Функция для выполнения Python кода
    const runCode = () => {
        try {
            // Очищаем вывод
            setOutput("");

            // Создаем копию текущего аквариума
            const newAquarium = { ...aquarium };

            // Функции, доступные для использования в коде ученика
            const pythonContext = {
                set_aquarium_type: (type) => {
                    newAquarium.type = type;
                    return `Тип аквариума изменен на: ${type}`;
                },
                add_plant: (plant) => {
                    newAquarium.plants.push(plant);
                    return `Добавлено растение: ${plant}`;
                },
                remove_plant: (plant) => {
                    newAquarium.plants = newAquarium.plants.filter(
                        (p) => p !== plant
                    );
                    return `Удалено растение: ${plant}`;
                },
                add_fish: (fish) => {
                    newAquarium.fish.push(fish);
                    return `Добавлена рыба: ${fish}`;
                },
                remove_fish: (fish) => {
                    newAquarium.fish = newAquarium.fish.filter(
                        (f) => f !== fish
                    );
                    return `Удалена рыба: ${fish}`;
                },
                set_temperature: (temp) => {
                    newAquarium.temperature = temp;
                    return `Установлена температура: ${temp}°C`;
                },
                set_ph: (ph) => {
                    newAquarium.ph = ph;
                    return `Установлен pH: ${ph}`;
                },
                check_compatibility: (fish1, fish2) => {
                    const compatibilityMap = {
                        сом: ["гурами", "данио", "цихлида"],
                        гуппи: ["данио", "меченосец", "тетра"],
                        "золотая рыбка": ["золотая рыбка"],
                    };

                    const compatible =
                        compatibilityMap[fish1]?.includes(fish2) ||
                        compatibilityMap[fish2]?.includes(fish1);

                    return `Рыбы ${fish1} и ${fish2} ${
                        compatible ? "совместимы" : "несовместимы"
                    }`;
                },
                print: (message) => {
                    setOutput((prev) => prev + message + "\n");
                    return message;
                },
            };

            // Имитация выполнения Python кода в JavaScript
            // В реальном приложении здесь был бы Python интерпретатор
            const lines = code
                .split("\n")
                .filter(
                    (line) => !line.trim().startsWith("#") && line.trim() !== ""
                );
            let results = [];

            for (const line of lines) {
                if (line.includes("set_aquarium_type")) {
                    const match = line.match(
                        /set_aquarium_type\(['"](.+)['"]\)/
                    );
                    if (match)
                        results.push(pythonContext.set_aquarium_type(match[1]));
                } else if (line.includes("add_plant")) {
                    const match = line.match(/add_plant\(['"](.+)['"]\)/);
                    if (match) results.push(pythonContext.add_plant(match[1]));
                } else if (line.includes("remove_plant")) {
                    const match = line.match(/remove_plant\(['"](.+)['"]\)/);
                    if (match)
                        results.push(pythonContext.remove_plant(match[1]));
                } else if (line.includes("add_fish")) {
                    const match = line.match(/add_fish\(['"](.+)['"]\)/);
                    if (match) results.push(pythonContext.add_fish(match[1]));
                } else if (line.includes("set_temperature")) {
                    const match = line.match(
                        /set_temperature\((\d+(?:\.\d+)?)\)/
                    );
                    if (match)
                        results.push(
                            pythonContext.set_temperature(parseFloat(match[1]))
                        );
                } else if (line.includes("set_ph")) {
                    const match = line.match(/set_ph\((\d+(?:\.\d+)?)\)/);
                    if (match)
                        results.push(
                            pythonContext.set_ph(parseFloat(match[1]))
                        );
                } else if (line.includes("print")) {
                    const match = line.match(/print\(['"](.+)['"]\)/);
                    if (match) pythonContext.print(match[1]);
                }
            }

            // Обновляем аквариум
            setAquarium(newAquarium);

            // Проверяем задание
            if (task.validation && task.validation(newAquarium)) {
                setOutput(
                    (prev) => prev + "\nОтлично! Задание выполнено успешно!"
                );
            } else if (task.validation) {
                setOutput(
                    (prev) =>
                        prev + "\nПока не совсем правильно. Попробуй еще раз!"
                );
            }

            // Выводим результаты выполнения
            setOutput((prev) => prev + "\n" + results.join("\n"));
        } catch (error) {
            setOutput(`Ошибка: ${error.message}`);
        }
    };

    // Функция для перехода к следующему уровню
    const nextLevel = () => {
        setLevel((prev) => prev + 1);
    };

    // Функция для перехода к предыдущему уровню
    const prevLevel = () => {
        if (level > 1) {
            setLevel((prev) => prev - 1);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1 className="title">ПитонАквариум</h1>
                <p className="subtitle">Изучаем Python через аквариумистику</p>
            </header>

            <div className="app-layout">
                {/* Левая панель с заданием */}
                <div className="task-panel">
                    <h2 className="panel-title">
                        Задание {task.id}: {task.title}
                    </h2>
                    <p className="task-description">{task.description}</p>
                    <div className="hint-box">
                        <h3 className="hint-title">Подсказка:</h3>
                        <p className="hint-text">{task.hint}</p>
                    </div>
                    <div className="navigation-buttons">
                        <button
                            className="button button-prev"
                            onClick={prevLevel}
                            disabled={level === 1}
                        >
                            ← Предыдущее
                        </button>
                        <button
                            className="button button-next"
                            onClick={nextLevel}
                        >
                            Следующее →
                        </button>
                    </div>
                </div>

                {/* Центральная панель с кодом */}
                <div className="code-panel">
                    <h2 className="panel-title">Код на Python</h2>
                    <textarea
                        className="code-editor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button className="button button-run" onClick={runCode}>
                        Запустить код
                    </button>

                    <div className="output-container">
                        <h3 className="output-title">Вывод программы:</h3>
                        <pre className="output-display">
                            {output ||
                                'Нажмите "Запустить код", чтобы увидеть результат'}
                        </pre>
                    </div>
                </div>

                {/* Правая панель с визуализацией */}
                <div className="aquarium-panel">
                    <h2 className="panel-title">Аквариум</h2>
                    <div className="aquarium-display">
                        {/* Визуализация аквариума */}
                        <div className="aquarium-bottom"></div>

                        {/* Растения */}
                        {aquarium.plants.includes("водоросли") && (
                            <div className="plant plant-seaweed"></div>
                        )}

                        {aquarium.plants.includes("коряга") && (
                            <div className="plant plant-driftwood"></div>
                        )}

                        {/* Рыбы */}
                        {aquarium.fish.includes("сом") && (
                            <div className="fish fish-catfish"></div>
                        )}

                        {aquarium.fish.includes("гуппи") && (
                            <div className="fish fish-guppy"></div>
                        )}

                        {aquarium.fish.includes("гурами") && (
                            <div className="fish fish-gourami"></div>
                        )}

                        {/* Тип аквариума влияет на визуальный стиль */}
                        {aquarium.type.includes("тёмный") && (
                            <div className="aquarium-overlay"></div>
                        )}
                    </div>

                    <div className="aquarium-params">
                        <h3 className="params-title">Параметры аквариума:</h3>
                        <ul className="params-list">
                            <li>
                                <strong>Тип:</strong> {aquarium.type}
                            </li>
                            <li>
                                <strong>Температура:</strong>{" "}
                                {aquarium.temperature}°C
                            </li>
                            <li>
                                <strong>pH:</strong> {aquarium.ph}
                            </li>
                            <li>
                                <strong>Растения:</strong>{" "}
                                {aquarium.plants.join(", ")}
                            </li>
                            <li>
                                <strong>Рыбы:</strong>{" "}
                                {aquarium.fish.join(", ")}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AquariumCodeApp;

// Добавить в настройки аквариума фильтр, форму аквариума. Добавить списки с возможными вариантами.
